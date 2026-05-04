package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"marineEnvSciencePopulariza/config"
	"marineEnvSciencePopulariza/models"
)

func GetNewsList(c *gin.Context) {
	var news []models.News
	var total int64

	page := 1
	pageSize := 10
	category := c.Query("category")

	if p := c.Query("page"); p != "" {
		page = 1
	}
	if ps := c.Query("page_size"); ps != "" {
		pageSize = 10
	}

	query := config.DB.Model(&models.News{})
	if category != "" {
		query = query.Where("category = ?", category)
	}
	query.Where("status = ?", "published")
	query.Count(&total)

	query.Order("is_top DESC, created_at DESC")
	query.Offset((page - 1) * pageSize).Limit(pageSize).Find(&news)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": gin.H{
			"list":      news,
			"total":     total,
			"page":      page,
			"page_size": pageSize,
		},
	})
}

func GetNewsDetail(c *gin.Context) {
	newsID := c.Param("id")

	var news models.News
	if err := config.DB.First(&news, newsID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "新闻不存在",
		})
		return
	}

	news.ViewCount++
	config.DB.Save(&news)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": news,
	})
}

func CreateNews(c *gin.Context) {
	var news models.News
	if err := c.ShouldBindJSON(&news); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code": 400,
			"msg":  "请求参数错误: " + err.Error(),
		})
		return
	}

	if err := config.DB.Create(&news).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "创建失败: " + err.Error(),
		})
		return
	}

	LogOperation(c, c.GetUint("user_id"), c.GetString("username"), "新闻管理", "创建", "创建新闻: "+news.Title)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "创建成功",
		"data": news,
	})
}

func UpdateNews(c *gin.Context) {
	newsID := c.Param("id")

	var existingNews models.News
	if err := config.DB.First(&existingNews, newsID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "新闻不存在",
		})
		return
	}

	var news models.News
	if err := c.ShouldBindJSON(&news); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code": 400,
			"msg":  "请求参数错误: " + err.Error(),
		})
		return
	}

	news.ID = existingNews.ID
	if err := config.DB.Save(&news).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "更新失败: " + err.Error(),
		})
		return
	}

	LogOperation(c, c.GetUint("user_id"), c.GetString("username"), "新闻管理", "更新", "更新新闻: "+news.Title)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "更新成功",
	})
}

func DeleteNews(c *gin.Context) {
	newsID := c.Param("id")

	var news models.News
	if err := config.DB.First(&news, newsID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "新闻不存在",
		})
		return
	}

	if err := config.DB.Delete(&news).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "删除失败: " + err.Error(),
		})
		return
	}

	LogOperation(c, c.GetUint("user_id"), c.GetString("username"), "新闻管理", "删除", "删除新闻: "+news.Title)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "删除成功",
	})
}

func GetClimateImpactList(c *gin.Context) {
	var items []models.ClimateImpact
	var total int64

	page := 1
	pageSize := 10
	category := c.Query("category")

	if p := c.Query("page"); p != "" {
		page = 1
	}
	if ps := c.Query("page_size"); ps != "" {
		pageSize = 10
	}

	query := config.DB.Model(&models.ClimateImpact{})
	if category != "" {
		query = query.Where("category = ?", category)
	}
	query.Where("status = ?", "published")
	query.Count(&total)

	query.Order("is_top DESC, created_at DESC")
	query.Offset((page - 1) * pageSize).Limit(pageSize).Find(&items)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": gin.H{
			"list":      items,
			"total":     total,
			"page":      page,
			"page_size": pageSize,
		},
	})
}

func GetClimateImpactDetail(c *gin.Context) {
	itemID := c.Param("id")

	var item models.ClimateImpact
	if err := config.DB.First(&item, itemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "内容不存在",
		})
		return
	}

	item.ViewCount++
	config.DB.Save(&item)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": item,
	})
}

func GetMarineLifeList(c *gin.Context) {
	var items []models.MarineLife
	var total int64

	page := 1
	pageSize := 10
	category := c.Query("category")

	if p := c.Query("page"); p != "" {
		page = 1
	}
	if ps := c.Query("page_size"); ps != "" {
		pageSize = 10
	}

	query := config.DB.Model(&models.MarineLife{})
	if category != "" {
		query = query.Where("category = ?", category)
	}
	query.Where("status = ?", "published")
	query.Count(&total)

	query.Order("is_top DESC, created_at DESC")
	query.Offset((page - 1) * pageSize).Limit(pageSize).Find(&items)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": gin.H{
			"list":      items,
			"total":     total,
			"page":      page,
			"page_size": pageSize,
		},
	})
}

func GetMarineLifeDetail(c *gin.Context) {
	itemID := c.Param("id")

	var item models.MarineLife
	if err := config.DB.First(&item, itemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "海洋生物不存在",
		})
		return
	}

	item.ViewCount++
	config.DB.Save(&item)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": item,
	})
}

func GetPollutionControlList(c *gin.Context) {
	var items []models.PollutionControl
	var total int64

	page := 1
	pageSize := 10
	category := c.Query("category")

	if p := c.Query("page"); p != "" {
		page = 1
	}
	if ps := c.Query("page_size"); ps != "" {
		pageSize = 10
	}

	query := config.DB.Model(&models.PollutionControl{})
	if category != "" {
		query = query.Where("category = ?", category)
	}
	query.Where("status = ?", "published")
	query.Count(&total)

	query.Order("is_top DESC, created_at DESC")
	query.Offset((page - 1) * pageSize).Limit(pageSize).Find(&items)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": gin.H{
			"list":      items,
			"total":     total,
			"page":      page,
			"page_size": pageSize,
		},
	})
}

func GetPollutionControlDetail(c *gin.Context) {
	itemID := c.Param("id")

	var item models.PollutionControl
	if err := config.DB.First(&item, itemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "内容不存在",
		})
		return
	}

	item.ViewCount++
	config.DB.Save(&item)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": item,
	})
}
