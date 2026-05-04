package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"marineEnvSciencePopulariza/config"
	"marineEnvSciencePopulariza/routers"
)

func main() {
	// 加载环境变量
	err := godotenv.Load()
	if err != nil {
		log.Println("警告: 未找到 .env 文件，使用系统环境变量")
	}

	// 初始化数据库
	config.InitDB()
	defer config.DB.Close()

	// 设置 Gin 模式
	ginMode := os.Getenv("GIN_MODE")
	if ginMode == "" {
		ginMode = "debug"
	}
	gin.SetMode(ginMode)

	// 创建 Gin 引擎
	r := gin.Default()

	// 配置路由
	routers.SetupRoutes(r)

	// 启动服务器
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("服务器启动在端口 %s\n", port)
	log.Fatal(r.Run(":" + port))
}
