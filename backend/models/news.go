package models

import (
	"time"
)

type News struct {
	ID          uint       `json:"id" gorm:"primary_key"`
	Title       string     `json:"title" gorm:"not null;size:200"`
	Content     string     `json:"content" gorm:"type:text"`
	Author      string     `json:"author" gorm:"size:50"`
	CoverImage  string     `json:"cover_image" gorm:"size:255"`
	Category    string     `json:"category" gorm:"size:50"`
	Tags        string     `json:"tags" gorm:"size:200"`
	ViewCount   int        `json:"view_count" gorm:"default:0"`
	IsTop       bool       `json:"is_top" gorm:"default:false"`
	Status      string     `json:"status" gorm:"size:20;default:'published'"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedAt   *time.Time `json:"-"`
}

type ClimateImpact struct {
	ID          uint       `json:"id" gorm:"primary_key"`
	Title       string     `json:"title" gorm:"not null;size:200"`
	Content     string     `json:"content" gorm:"type:text"`
	CoverImage  string     `json:"cover_image" gorm:"size:255"`
	Category    string     `json:"category" gorm:"size:50"`
	Tags        string     `json:"tags" gorm:"size:200"`
	ViewCount   int        `json:"view_count" gorm:"default:0"`
	IsTop       bool       `json:"is_top" gorm:"default:false"`
	Status      string     `json:"status" gorm:"size:20;default:'published'"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedAt   *time.Time `json:"-"`
}

type MarineLife struct {
	ID          uint       `json:"id" gorm:"primary_key"`
	Name        string     `json:"name" gorm:"not null;size:100"`
	Description string     `json:"description" gorm:"type:text"`
	Content     string     `json:"content" gorm:"type:text"`
	CoverImage  string     `json:"cover_image" gorm:"size:255"`
	Category    string     `json:"category" gorm:"size:50"`
	Habitat     string     `json:"habitat" gorm:"size:100"`
	Diet        string     `json:"diet" gorm:"size:200"`
	Size        string     `json:"size" gorm:"size:100"`
	Lifespan    string     `json:"lifespan" gorm:"size:100"`
	Tags        string     `json:"tags" gorm:"size:200"`
	ViewCount   int        `json:"view_count" gorm:"default:0"`
	IsTop       bool       `json:"is_top" gorm:"default:false"`
	Status      string     `json:"status" gorm:"size:20;default:'published'"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedAt   *time.Time `json:"-"`
}

type PollutionControl struct {
	ID          uint       `json:"id" gorm:"primary_key"`
	Title       string     `json:"title" gorm:"not null;size:200"`
	Content     string     `json:"content" gorm:"type:text"`
	CoverImage  string     `json:"cover_image" gorm:"size:255"`
	Category    string     `json:"category" gorm:"size:50"`
	Tags        string     `json:"tags" gorm:"size:200"`
	ViewCount   int        `json:"view_count" gorm:"default:0"`
	IsTop       bool       `json:"is_top" gorm:"default:false"`
	Status      string     `json:"status" gorm:"size:20;default:'published'"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedAt   *time.Time `json:"-"`
}
