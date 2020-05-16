from django.shortcuts import render
from django.http import HttpResponse


def Home_Page(request) :
    return render(request, 'HomePage/home.html')