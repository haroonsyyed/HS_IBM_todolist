from django.db import models
from django.contrib.auth.models import User

class todo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    status = models.BooleanField(default=False, blank=True)

# Create your models here.
