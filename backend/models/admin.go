package models

import (
	"time"

	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

type Admin struct {
	ID        uint       `json:"id" gorm:"primary_key"`
	Username  string     `json:"username" gorm:"unique;not null;size:50"`
	Password  string     `json:"-" gorm:"not null"`
	Nickname  string     `json:"nickname" gorm:"size:50"`
	Avatar    string     `json:"avatar" gorm:"size:255"`
	Role      string     `json:"role" gorm:"size:20;default:'admin'"`
	Status    string     `json:"status" gorm:"size:20;default:'active'"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"-"`
}

func (admin *Admin) BeforeCreate(scope *gorm.Scope) error {
	// 加密密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(admin.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	admin.Password = string(hashedPassword)
	return nil
}

func (admin *Admin) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(password))
	return err == nil
}

func (admin *Admin) UpdatePassword(newPassword string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	admin.Password = string(hashedPassword)
	return nil
}
