package config

import (
	"fmt"
	"log"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"marineEnvSciencePopulariza/models"
)

var DB *gorm.DB

func InitDB() {
	var err error

	// 获取数据库配置
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	// 构建数据库连接字符串
	dbURI := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local",
		dbUser, dbPassword, dbHost, dbPort, dbName)

	// 连接数据库
	DB, err = gorm.Open("mysql", dbURI)
	if err != nil {
		log.Fatalf("数据库连接失败: %v", err)
	}

	// 设置数据库连接池
	DB.DB().SetMaxIdleConns(10)
	DB.DB().SetMaxOpenConns(100)

	// 自动迁移表结构
	AutoMigrate()

	log.Println("数据库连接成功")
}

func AutoMigrate() {
	// 自动迁移表结构
	DB.AutoMigrate(
		&models.User{},
		&models.Admin{},
		&models.News{},
		&models.ClimateImpact{},
		&models.MarineLife{},
		&models.PollutionControl{},
		&models.Question{},
		&models.Answer{},
		&models.Carousel{},
		&models.Menu{},
		&models.Announcement{},
		&models.OperationLog{},
		&models.ForumPost{},
		&models.ForumComment{},
		&models.Seat{},
		&models.Reservation{},
		&models.SignIn{},
	)
	log.Println("数据库表迁移完成")
}
