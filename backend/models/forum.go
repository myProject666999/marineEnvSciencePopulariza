package models

import (
	"time"
)

type ForumPost struct {
	ID          uint       `json:"id" gorm:"primary_key"`
	Title       string     `json:"title" gorm:"not null;size:200"`
	Content     string     `json:"content" gorm:"type:text"`
	UserID      uint       `json:"user_id"`
	User        User       `json:"user" gorm:"foreignkey:UserID"`
	Category    string     `json:"category" gorm:"size:50"`
	Tags        string     `json:"tags" gorm:"size:200"`
	ViewCount   int        `json:"view_count" gorm:"default:0"`
	CommentCount int       `json:"comment_count" gorm:"default:0"`
	LikeCount   int        `json:"like_count" gorm:"default:0"`
	IsTop       bool       `json:"is_top" gorm:"default:false"`
	IsHot       bool       `json:"is_hot" gorm:"default:false"`
	Status      string     `json:"status" gorm:"size:20;default:'published'"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedAt   *time.Time `json:"-"`
}

type ForumComment struct {
	ID        uint       `json:"id" gorm:"primary_key"`
	Content   string     `json:"content" gorm:"type:text"`
	PostID    uint       `json:"post_id"`
	Post      ForumPost  `json:"post" gorm:"foreignkey:PostID"`
	UserID    uint       `json:"user_id"`
	User      User       `json:"user" gorm:"foreignkey:UserID"`
	ParentID  uint       `json:"parent_id" gorm:"default:0"`
	LikeCount int        `json:"like_count" gorm:"default:0"`
	Status    string     `json:"status" gorm:"size:20;default:'published'"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"-"`
}

type Seat struct {
	ID          uint       `json:"id" gorm:"primary_key"`
	SeatNumber  string     `json:"seat_number" gorm:"unique;not null;size:20"`
	Area        string     `json:"area" gorm:"size:50"`
	Description string     `json:"description" gorm:"size:200"`
	Status      string     `json:"status" gorm:"size:20;default:'available'"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedAt   *time.Time `json:"-"`
}

type Reservation struct {
	ID              uint       `json:"id" gorm:"primary_key"`
	UserID          uint       `json:"user_id"`
	User            User       `json:"user" gorm:"foreignkey:UserID"`
	SeatID          uint       `json:"seat_id"`
	Seat            Seat       `json:"seat" gorm:"foreignkey:SeatID"`
	ReservationDate time.Time  `json:"reservation_date"`
	StartTime       string     `json:"start_time" gorm:"size:20"`
	EndTime         string     `json:"end_time" gorm:"size:20"`
	Purpose         string     `json:"purpose" gorm:"size:500"`
	Status          string     `json:"status" gorm:"size:20;default:'pending'"`
	IsSignedIn      bool       `json:"is_signed_in" gorm:"default:false"`
	SignInTime      *time.Time `json:"sign_in_time"`
	CancelReason    string     `json:"cancel_reason" gorm:"size:500"`
	CanceledAt      *time.Time `json:"canceled_at"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
	DeletedAt       *time.Time `json:"-"`
}

type SignIn struct {
	ID            uint       `json:"id" gorm:"primary_key"`
	ReservationID uint       `json:"reservation_id"`
	Reservation   Reservation `json:"reservation" gorm:"foreignkey:ReservationID"`
	UserID        uint       `json:"user_id"`
	User          User       `json:"user" gorm:"foreignkey:UserID"`
	SignInTime    time.Time  `json:"sign_in_time"`
	IP            string     `json:"ip" gorm:"size:50"`
	Location      string     `json:"location" gorm:"size:200"`
	CreatedAt     time.Time  `json:"created_at"`
}
