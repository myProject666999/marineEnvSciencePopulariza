package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"marineEnvSciencePopulariza/config"
	"marineEnvSciencePopulariza/models"
)

func GetSeatList(c *gin.Context) {
	var seats []models.Seat
	var total int64

	page := 1
	pageSize := 10
	status := c.Query("status")

	if p := c.Query("page"); p != "" {
		page = 1
	}
	if ps := c.Query("page_size"); ps != "" {
		pageSize = 10
	}

	query := config.DB.Model(&models.Seat{})
	if status != "" {
		query = query.Where("status = ?", status)
	}
	query.Count(&total)

	query.Order("created_at DESC")
	query.Offset((page - 1) * pageSize).Limit(pageSize).Find(&seats)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": gin.H{
			"list":      seats,
			"total":     total,
			"page":      page,
			"page_size": pageSize,
		},
	})
}

func CreateSeat(c *gin.Context) {
	var seat models.Seat
	if err := c.ShouldBindJSON(&seat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code": 400,
			"msg":  "请求参数错误: " + err.Error(),
		})
		return
	}

	seat.Status = "available"

	if err := config.DB.Create(&seat).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "创建失败: " + err.Error(),
		})
		return
	}

	LogOperation(c, c.GetUint("user_id"), c.GetString("username"), "座位管理", "创建", "创建座位: "+seat.SeatNumber)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "创建成功",
		"data": seat,
	})
}

func UpdateSeat(c *gin.Context) {
	seatID := c.Param("id")

	var existingSeat models.Seat
	if err := config.DB.First(&existingSeat, seatID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "座位不存在",
		})
		return
	}

	var seat models.Seat
	if err := c.ShouldBindJSON(&seat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code": 400,
			"msg":  "请求参数错误: " + err.Error(),
		})
		return
	}

	seat.ID = existingSeat.ID
	if err := config.DB.Save(&seat).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "更新失败: " + err.Error(),
		})
		return
	}

	LogOperation(c, c.GetUint("user_id"), c.GetString("username"), "座位管理", "更新", "更新座位: "+seat.SeatNumber)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "更新成功",
	})
}

func DeleteSeat(c *gin.Context) {
	seatID := c.Param("id")

	var seat models.Seat
	if err := config.DB.First(&seat, seatID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "座位不存在",
		})
		return
	}

	if err := config.DB.Delete(&seat).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "删除失败: " + err.Error(),
		})
		return
	}

	LogOperation(c, c.GetUint("user_id"), c.GetString("username"), "座位管理", "删除", "删除座位: "+seat.SeatNumber)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "删除成功",
	})
}

func GetReservationList(c *gin.Context) {
	var reservations []models.Reservation
	var total int64

	page := 1
	pageSize := 10
	status := c.Query("status")

	if p := c.Query("page"); p != "" {
		page = 1
	}
	if ps := c.Query("page_size"); ps != "" {
		pageSize = 10
	}

	query := config.DB.Model(&models.Reservation{}).Preload("User").Preload("Seat")
	if status != "" {
		query = query.Where("status = ?", status)
	}
	query.Count(&total)

	query.Order("created_at DESC")
	query.Offset((page - 1) * pageSize).Limit(pageSize).Find(&reservations)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": gin.H{
			"list":      reservations,
			"total":     total,
			"page":      page,
			"page_size": pageSize,
		},
	})
}

func GetUserReservations(c *gin.Context) {
	userID := c.GetUint("user_id")

	var reservations []models.Reservation
	var total int64

	page := 1
	pageSize := 10

	if p := c.Query("page"); p != "" {
		page = 1
	}
	if ps := c.Query("page_size"); ps != "" {
		pageSize = 10
	}

	query := config.DB.Model(&models.Reservation{}).Preload("Seat").Where("user_id = ?", userID)
	query.Count(&total)

	query.Order("created_at DESC")
	query.Offset((page - 1) * pageSize).Limit(pageSize).Find(&reservations)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": gin.H{
			"list":      reservations,
			"total":     total,
			"page":      page,
			"page_size": pageSize,
		},
	})
}

func CreateReservation(c *gin.Context) {
	userID := c.GetUint("user_id")

	var reservation models.Reservation
	if err := c.ShouldBindJSON(&reservation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code": 400,
			"msg":  "请求参数错误: " + err.Error(),
		})
		return
	}

	reservation.UserID = userID
	reservation.Status = "pending"
	reservation.IsSignedIn = false

	if err := config.DB.Create(&reservation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "创建失败: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "预约成功",
		"data": reservation,
	})
}

func ApproveReservation(c *gin.Context) {
	reservationID := c.Param("id")

	var reservation models.Reservation
	if err := config.DB.First(&reservation, reservationID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "预约不存在",
		})
		return
	}

	if reservation.Status != "pending" {
		c.JSON(http.StatusBadRequest, gin.H{
			"code": 400,
			"msg":  "只能审核待处理的预约",
		})
		return
	}

	reservation.Status = "approved"
	if err := config.DB.Save(&reservation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "更新失败: " + err.Error(),
		})
		return
	}

	LogOperation(c, c.GetUint("user_id"), c.GetString("username"), "预约管理", "审核", "审核通过预约ID: "+reservationID)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "审核通过",
	})
}

func RejectReservation(c *gin.Context) {
	reservationID := c.Param("id")

	var reservation models.Reservation
	if err := config.DB.First(&reservation, reservationID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "预约不存在",
		})
		return
	}

	if reservation.Status != "pending" {
		c.JSON(http.StatusBadRequest, gin.H{
			"code": 400,
			"msg":  "只能拒绝待处理的预约",
		})
		return
	}

	reservation.Status = "rejected"
	if err := config.DB.Save(&reservation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "更新失败: " + err.Error(),
		})
		return
	}

	LogOperation(c, c.GetUint("user_id"), c.GetString("username"), "预约管理", "拒绝", "拒绝预约ID: "+reservationID)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "已拒绝",
	})
}

func CancelReservation(c *gin.Context) {
	userID := c.GetUint("user_id")
	reservationID := c.Param("id")

	var reservation models.Reservation
	if err := config.DB.First(&reservation, reservationID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "预约不存在",
		})
		return
	}

	if reservation.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{
			"code": 403,
			"msg":  "只能取消自己的预约",
		})
		return
	}

	if reservation.Status == "canceled" || reservation.Status == "completed" {
		c.JSON(http.StatusBadRequest, gin.H{
			"code": 400,
			"msg":  "该预约无法取消",
		})
		return
	}

	var req struct {
		Reason string `json:"reason"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		req.Reason = "用户主动取消"
	}

	now := time.Now()
	reservation.Status = "canceled"
	reservation.CancelReason = req.Reason
	reservation.CanceledAt = &now

	if err := config.DB.Save(&reservation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "取消失败: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "取消成功",
	})
}

func SignIn(c *gin.Context) {
	userID := c.GetUint("user_id")
	reservationID := c.Param("id")

	var reservation models.Reservation
	if err := config.DB.First(&reservation, reservationID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "预约不存在",
		})
		return
	}

	if reservation.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{
			"code": 403,
			"msg":  "只能签到自己的预约",
		})
		return
	}

	if reservation.IsSignedIn {
		c.JSON(http.StatusBadRequest, gin.H{
			"code": 400,
			"msg":  "已签到",
		})
		return
	}

	now := time.Now()
	reservation.IsSignedIn = true
	reservation.SignInTime = &now
	reservation.Status = "completed"

	if err := config.DB.Save(&reservation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "签到失败: " + err.Error(),
		})
		return
	}

	signIn := models.SignIn{
		ReservationID: reservation.ID,
		UserID:        userID,
		SignInTime:    now,
		IP:            c.ClientIP(),
	}

	if err := config.DB.Create(&signIn).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "签到记录创建失败: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "签到成功",
	})
}
