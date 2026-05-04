package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"marineEnvSciencePopulariza/config"
	"marineEnvSciencePopulariza/models"
	"marineEnvSciencePopulariza/utils"
)

type AdminLoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type CreateAdminRequest struct {
	Username        string `json:"username" binding:"required,min=3,max=50"`
	Password        string `json:"password" binding:"required,min=6,max=20"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
	Nickname        string `json:"nickname"`
}

func AdminLogin(c *gin.Context) {
	var req AdminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code": 400,
			"msg":  "请求参数错误: " + err.Error(),
		})
		return
	}

	var admin models.Admin
	if err := config.DB.Where("username = ?", req.Username).First(&admin).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code": 401,
			"msg":  "用户名或密码错误",
		})
		return
	}

	if admin.Status != "active" {
		c.JSON(http.StatusForbidden, gin.H{
			"code": 403,
			"msg":  "账号已被禁用",
		})
		return
	}

	if !admin.CheckPassword(req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code": 401,
			"msg":  "用户名或密码错误",
		})
		return
	}

	token, err := utils.GenerateToken(admin.ID, admin.Username, "admin")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "生成Token失败",
		})
		return
	}

	LogOperation(c, admin.ID, admin.Username, "认证", "登录", "管理员登录系统")

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "登录成功",
		"data": gin.H{
			"token": token,
			"user": gin.H{
				"id":       admin.ID,
				"username": admin.Username,
				"nickname": admin.Nickname,
				"avatar":   admin.Avatar,
				"role":     admin.Role,
			},
		},
	})
}

func GetAdminInfo(c *gin.Context) {
	adminID := c.GetUint("user_id")

	var admin models.Admin
	if err := config.DB.First(&admin, adminID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "管理员不存在",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": gin.H{
			"id":       admin.ID,
			"username": admin.Username,
			"nickname": admin.Nickname,
			"avatar":   admin.Avatar,
			"role":     admin.Role,
		},
	})
}

func GetUserStatistics(c *gin.Context) {
	var totalUsers int64
	var activeUsers int64
	var todayNewUsers int64

	config.DB.Model(&models.User{}).Count(&totalUsers)
	config.DB.Model(&models.User{}).Where("status = ?", "active").Count(&activeUsers)

	today := time.Now().Format("2006-01-02")
	config.DB.Model(&models.User{}).Where("DATE(created_at) = ?", today).Count(&todayNewUsers)

	LogOperation(c, c.GetUint("user_id"), c.GetString("username"), "统计", "查询", "查询用户统计数据")

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": gin.H{
			"total_users":      totalUsers,
			"active_users":     activeUsers,
			"today_new_users":  todayNewUsers,
		},
	})
}

func GetReservationStatistics(c *gin.Context) {
	var totalReservations int64
	var pendingReservations int64
	var completedReservations int64
	var canceledReservations int64
	var todayReservations int64

	config.DB.Model(&models.Reservation{}).Count(&totalReservations)
	config.DB.Model(&models.Reservation{}).Where("status = ?", "pending").Count(&pendingReservations)
	config.DB.Model(&models.Reservation{}).Where("status = ?", "completed").Count(&completedReservations)
	config.DB.Model(&models.Reservation{}).Where("status = ?", "canceled").Count(&canceledReservations)

	today := time.Now().Format("2006-01-02")
	config.DB.Model(&models.Reservation{}).Where("DATE(created_at) = ?", today).Count(&todayReservations)

	LogOperation(c, c.GetUint("user_id"), c.GetString("username"), "统计", "查询", "查询预约统计数据")

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": gin.H{
			"total_reservations":      totalReservations,
			"pending_reservations":    pendingReservations,
			"completed_reservations":  completedReservations,
			"canceled_reservations":   canceledReservations,
			"today_reservations":      todayReservations,
		},
	})
}

func CreateAdmin(c *gin.Context) {
	var req CreateAdminRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code": 400,
			"msg":  "请求参数错误: " + err.Error(),
		})
		return
	}

	if req.Password != req.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{
			"code": 400,
			"msg":  "两次密码输入不一致",
		})
		return
	}

	var existingAdmin models.Admin
	if config.DB.Where("username = ?", req.Username).First(&existingAdmin).Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code": 400,
			"msg":  "用户名已存在",
		})
		return
	}

	admin := models.Admin{
		Username: req.Username,
		Password: req.Password,
		Nickname: req.Nickname,
		Role:     "admin",
		Status:   "active",
	}

	if err := config.DB.Create(&admin).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "创建失败: " + err.Error(),
		})
		return
	}

	LogOperation(c, c.GetUint("user_id"), c.GetString("username"), "管理员管理", "创建", "创建新管理员: "+admin.Username)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "创建成功",
		"data": gin.H{
			"id":       admin.ID,
			"username": admin.Username,
		},
	})
}

func GetAdminList(c *gin.Context) {
	var admins []models.Admin
	var total int64

	page := 1
	pageSize := 10

	if p := c.Query("page"); p != "" {
		page = 1
	}
	if ps := c.Query("page_size"); ps != "" {
		pageSize = 10
	}

	config.DB.Model(&models.Admin{}).Count(&total)
	config.DB.Offset((page - 1) * pageSize).Limit(pageSize).Find(&admins)

	LogOperation(c, c.GetUint("user_id"), c.GetString("username"), "管理员管理", "查询", "查询管理员列表")

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": gin.H{
			"list":      admins,
			"total":     total,
			"page":      page,
			"page_size": pageSize,
		},
	})
}

func GetUserList(c *gin.Context) {
	var users []models.User
	var total int64

	page := 1
	pageSize := 10

	if p := c.Query("page"); p != "" {
		page = 1
	}
	if ps := c.Query("page_size"); ps != "" {
		pageSize = 10
	}

	config.DB.Model(&models.User{}).Count(&total)
	config.DB.Offset((page - 1) * pageSize).Limit(pageSize).Find(&users)

	LogOperation(c, c.GetUint("user_id"), c.GetString("username"), "用户管理", "查询", "查询用户列表")

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": gin.H{
			"list":      users,
			"total":     total,
			"page":      page,
			"page_size": pageSize,
		},
	})
}

func UpdateUserStatus(c *gin.Context) {
	userID := c.Param("id")
	status := c.Query("status")

	if status != "active" && status != "disabled" {
		c.JSON(http.StatusBadRequest, gin.H{
			"code": 400,
			"msg":  "状态值无效",
		})
		return
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "用户不存在",
		})
		return
	}

	user.Status = status
	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "更新失败: " + err.Error(),
		})
		return
	}

	LogOperation(c, c.GetUint("user_id"), c.GetString("username"), "用户管理", "更新", "更新用户状态: "+user.Username)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "更新成功",
	})
}

func LogOperation(c *gin.Context, adminID uint, adminName, module, action, description string) {
	log := models.OperationLog{
		AdminID:     adminID,
		AdminName:   adminName,
		Module:      module,
		Action:      action,
		Description: description,
		IP:          c.ClientIP(),
		UserAgent:   c.GetHeader("User-Agent"),
		CreatedAt:   time.Now(),
	}
	config.DB.Create(&log)
}
