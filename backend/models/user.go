package models

import (
	"time"

	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID        uint       `json:"id" gorm:"primary_key"`
	Username  string     `json:"username" gorm:"unique;not null;size:50"`
	Email     string     `json:"email" gorm:"unique;not null;size:100"`
	Password  string     `json:"-" gorm:"not null"`
	Nickname  string     `json:"nickname" gorm:"size:50"`
	Avatar    string     `json:"avatar" gorm:"size:255"`
	Phone     string     `json:"phone" gorm:"size:20"`
	Role      string     `json:"role" gorm:"size:20;default:'user'"`
	Status    string     `json:"status" gorm:"size:20;default:'active'"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"-"`
}

func (user *User) BeforeCreate(scope *gorm.Scope) error {
	// 加密密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	return nil
}

func (user *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	return err == nil
}

func (user *User) UpdatePassword(newPassword string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	return nil
}
