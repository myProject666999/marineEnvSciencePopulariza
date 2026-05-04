package models

import (
	"time"
)

type Question struct {
	ID          uint       `json:"id" gorm:"primary_key"`
	Title       string     `json:"title" gorm:"not null;size:200"`
	Content     string     `json:"content" gorm:"type:text"`
	UserID      uint       `json:"user_id"`
	User        User       `json:"user" gorm:"foreignkey:UserID"`
	Category    string     `json:"category" gorm:"size:50"`
	Tags        string     `json:"tags" gorm:"size:200"`
	ViewCount   int        `json:"view_count" gorm:"default:0"`
	AnswerCount int        `json:"answer_count" gorm:"default:0"`
	IsSolved    bool       `json:"is_solved" gorm:"default:false"`
	Status      string     `json:"status" gorm:"size:20;default:'published'"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedAt   *time.Time `json:"-"`
}

type Answer struct {
	ID         uint       `json:"id" gorm:"primary_key"`
	Content    string     `json:"content" gorm:"type:text"`
	QuestionID uint       `json:"question_id"`
	Question   Question   `json:"question" gorm:"foreignkey:QuestionID"`
	UserID     uint       `json:"user_id"`
	User       User       `json:"user" gorm:"foreignkey:UserID"`
	IsAccepted bool       `json:"is_accepted" gorm:"default:false"`
	LikeCount  int        `json:"like_count" gorm:"default:0"`
	Status     string     `json:"status" gorm:"size:20;default:'published'"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
	DeletedAt  *time.Time `json:"-"`
}

type Carousel struct {
	ID        uint       `json:"id" gorm:"primary_key"`
	Title     string     `json:"title" gorm:"size:200"`
	ImageUrl  string     `json:"image_url" gorm:"not null;size:255"`
	LinkUrl   string     `json:"link_url" gorm:"size:255"`
	Sort      int        `json:"sort" gorm:"default:0"`
	IsActive  bool       `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"-"`
}

type Menu struct {
	ID        uint       `json:"id" gorm:"primary_key"`
	Name      string     `json:"name" gorm:"not null;size:50"`
	ParentID  uint       `json:"parent_id" gorm:"default:0"`
	Path      string     `json:"path" gorm:"size:255"`
	Icon      string     `json:"icon" gorm:"size:100"`
	Sort      int        `json:"sort" gorm:"default:0"`
	IsActive  bool       `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"-"`
}

type Announcement struct {
	ID        uint       `json:"id" gorm:"primary_key"`
	Title     string     `json:"title" gorm:"not null;size:200"`
	Content   string     `json:"content" gorm:"type:text"`
	Author    string     `json:"author" gorm:"size:50"`
	IsTop     bool       `json:"is_top" gorm:"default:false"`
	IsActive  bool       `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"-"`
}

type OperationLog struct {
	ID          uint       `json:"id" gorm:"primary_key"`
	AdminID     uint       `json:"admin_id"`
	AdminName   string     `json:"admin_name" gorm:"size:50"`
	Module      string     `json:"module" gorm:"size:50"`
	Action      string     `json:"action" gorm:"size:50"`
	Description string     `json:"description" gorm:"size:500"`
	IP          string     `json:"ip" gorm:"size:50"`
	UserAgent   string     `json:"user_agent" gorm:"size:255"`
	CreatedAt   time.Time  `json:"created_at"`
}
