"""Project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from AppGame.views import manageMatch, disconnectPlayer, matchsDetails
from AppAuthentification.views import (
    register,
    changePassword,
    infosUser,
    deleteUser,
    login,
    logout,
    enable2FA,
    confirm2FA,
    isUserAuthentified,
    disable2FA,
    addFriend,
    listFriends,
    removeFriend,
    addAvatar,
    getAvatar,
    loginWith42,
    callBack42,
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', register),
    path('api/login/', login),
    path('api/logout/', logout),
    path('api/isUserAuthentified/', isUserAuthentified),
    path('api/deleteUser/', deleteUser),
    #2FA
    path('api/enable2FA/', enable2FA),
    path('api/confirm2FA/', confirm2FA),
    path('api/disable2FA/', disable2FA),
    #settings
    path('api/infosUser/', infosUser),
    path('api/changePassword/', changePassword),
    #Friends
    path('api/addFriend/', addFriend),
    path('api/listFriends/', listFriends),
    path('api/removeFriend/', removeFriend),
    #avatar
    path('api/addAvatar/', addAvatar),
    path('api/getAvatar/', getAvatar),
    #api42
    path('api/loginWith42/', loginWith42),
    path('api/callBack42/', callBack42),
    #Match
    path('api/manageMatch/', manageMatch),
    path('api/disconnectPlayer/', disconnectPlayer),
    path('api/matchsDetails/', matchsDetails),
]
