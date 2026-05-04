package routers

import (
	"github.com/gin-gonic/gin"
	"marineEnvSciencePopulariza/controllers"
	"marineEnvSciencePopulariza/middleware"
)

func SetupRoutes(r *gin.Engine) {
	r.Use(CORSMiddleware())

	api := r.Group("/api")
	{
		// 公开路由 - 用户认证
		userPublic := api.Group("/user")
		{
			userPublic.POST("/register", controllers.UserRegister)
			userPublic.POST("/login", controllers.UserLogin)
		}

		// 公开路由 - 管理员认证
		adminPublic := api.Group("/admin")
		{
			adminPublic.POST("/login", controllers.AdminLogin)
		}

		// 公开路由 - 内容浏览
		contentPublic := api.Group("/content")
		{
			// 新闻资讯
			contentPublic.GET("/news", controllers.GetNewsList)
			contentPublic.GET("/news/:id", controllers.GetNewsDetail)

			// 气候变化与海洋影响
			contentPublic.GET("/climate", controllers.GetClimateImpactList)
			contentPublic.GET("/climate/:id", controllers.GetClimateImpactDetail)

			// 海洋生物科普
			contentPublic.GET("/marine-life", controllers.GetMarineLifeList)
			contentPublic.GET("/marine-life/:id", controllers.GetMarineLifeDetail)

			// 海洋污染与治理
			contentPublic.GET("/pollution", controllers.GetPollutionControlList)
			contentPublic.GET("/pollution/:id", controllers.GetPollutionControlDetail)

			// 互动问答
			contentPublic.GET("/questions", controllers.GetQuestionList)
			contentPublic.GET("/questions/:id", controllers.GetQuestionDetail)

			// 座位列表（公开，供用户预约时选择）
			contentPublic.GET("/seats", controllers.GetSeatList)
		}

		// 用户路由 - 需要登录
		userAuth := api.Group("/user")
		userAuth.Use(middleware.AuthMiddleware(), middleware.UserMiddleware())
		{
			// 个人信息
			userAuth.GET("/profile", controllers.GetUserInfo)
			userAuth.PUT("/profile", controllers.UpdateUserProfile)
			userAuth.PUT("/password", controllers.UpdateUserPassword)

			// 互动问答
			userAuth.POST("/questions", controllers.CreateQuestion)
			userAuth.POST("/questions/:id/answers", controllers.CreateAnswer)
			userAuth.PUT("/answers/:id/accept", controllers.AcceptAnswer)
			userAuth.POST("/answers/:id/like", controllers.LikeAnswer)

			// 预约管理
			userAuth.GET("/reservations", controllers.GetUserReservations)
			userAuth.POST("/reservations", controllers.CreateReservation)
			userAuth.POST("/reservations/:id/cancel", controllers.CancelReservation)
			userAuth.POST("/reservations/:id/signin", controllers.SignIn)
		}

		// 管理员路由 - 需要登录和管理员权限
		adminAuth := api.Group("/admin")
		adminAuth.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
		{
			// 管理员信息
			adminAuth.GET("/profile", controllers.GetAdminInfo)

			// 统计
			adminAuth.GET("/statistics/users", controllers.GetUserStatistics)
			adminAuth.GET("/statistics/reservations", controllers.GetReservationStatistics)

			// 管理员管理
			adminAuth.POST("/admins", controllers.CreateAdmin)
			adminAuth.GET("/admins", controllers.GetAdminList)

			// 用户管理
			adminAuth.GET("/users", controllers.GetUserList)
			adminAuth.PUT("/users/:id/status", controllers.UpdateUserStatus)

			// 新闻管理
			adminAuth.POST("/news", controllers.CreateNews)
			adminAuth.PUT("/news/:id", controllers.UpdateNews)
			adminAuth.DELETE("/news/:id", controllers.DeleteNews)

			// 座位管理
			adminAuth.GET("/seats", controllers.GetSeatList)
			adminAuth.POST("/seats", controllers.CreateSeat)
			adminAuth.PUT("/seats/:id", controllers.UpdateSeat)
			adminAuth.DELETE("/seats/:id", controllers.DeleteSeat)

			// 预约管理
			adminAuth.GET("/reservations", controllers.GetReservationList)
			adminAuth.PUT("/reservations/:id/approve", controllers.ApproveReservation)
			adminAuth.PUT("/reservations/:id/reject", controllers.RejectReservation)
		}
	}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
