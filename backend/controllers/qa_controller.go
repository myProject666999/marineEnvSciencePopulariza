package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"marineEnvSciencePopulariza/config"
	"marineEnvSciencePopulariza/models"
)

func GetQuestionList(c *gin.Context) {
	var questions []models.Question
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

	query := config.DB.Model(&models.Question{}).Preload("User")
	if category != "" {
		query = query.Where("category = ?", category)
	}
	query.Where("status = ?", "published")
	query.Count(&total)

	query.Order("created_at DESC")
	query.Offset((page - 1) * pageSize).Limit(pageSize).Find(&questions)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": gin.H{
			"list":      questions,
			"total":     total,
			"page":      page,
			"page_size": pageSize,
		},
	})
}

func GetQuestionDetail(c *gin.Context) {
	questionID := c.Param("id")

	var question models.Question
	if err := config.DB.Preload("User").First(&question, questionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "问题不存在",
		})
		return
	}

	question.ViewCount++
	config.DB.Save(&question)

	var answers []models.Answer
	config.DB.Preload("User").Where("question_id = ?", questionID).Order("is_accepted DESC, created_at DESC").Find(&answers)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "获取成功",
		"data": gin.H{
			"question": question,
			"answers":  answers,
		},
	})
}

func CreateQuestion(c *gin.Context) {
	userID := c.GetUint("user_id")

	var question models.Question
	if err := c.ShouldBindJSON(&question); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code": 400,
			"msg":  "请求参数错误: " + err.Error(),
		})
		return
	}

	question.UserID = userID
	question.Status = "published"

	if err := config.DB.Create(&question).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "创建失败: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "创建成功",
		"data": question,
	})
}

func CreateAnswer(c *gin.Context) {
	userID := c.GetUint("user_id")
	questionID := c.Param("id")

	var answer models.Answer
	if err := c.ShouldBindJSON(&answer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code": 400,
			"msg":  "请求参数错误: " + err.Error(),
		})
		return
	}

	answer.UserID = userID
	answer.QuestionID = 0
	var qid uint
	if _, err := fmt.Sscan(questionID, &qid); err == nil {
		answer.QuestionID = qid
	}
	answer.Status = "published"

	if err := config.DB.Create(&answer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "创建失败: " + err.Error(),
		})
		return
	}

	var question models.Question
	config.DB.First(&question, answer.QuestionID)
	question.AnswerCount++
	config.DB.Save(&question)

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "创建成功",
		"data": answer,
	})
}

func AcceptAnswer(c *gin.Context) {
	userID := c.GetUint("user_id")
	answerID := c.Param("id")

	var answer models.Answer
	if err := config.DB.First(&answer, answerID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "回答不存在",
		})
		return
	}

	var question models.Question
	if err := config.DB.First(&question, answer.QuestionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "问题不存在",
		})
		return
	}

	if question.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{
			"code": 403,
			"msg":  "只能采纳自己问题的回答",
		})
		return
	}

	answer.IsAccepted = true
	question.IsSolved = true

	if err := config.DB.Save(&answer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "更新失败: " + err.Error(),
		})
		return
	}

	if err := config.DB.Save(&question).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "更新失败: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "采纳成功",
	})
}

func LikeAnswer(c *gin.Context) {
	answerID := c.Param("id")

	var answer models.Answer
	if err := config.DB.First(&answer, answerID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code": 404,
			"msg":  "回答不存在",
		})
		return
	}

	answer.LikeCount++
	if err := config.DB.Save(&answer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "更新失败: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "点赞成功",
	})
}
