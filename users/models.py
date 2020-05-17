from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from TransitPass.models import State, District


class CustomUserManager(UserManager) :
    pass


class CustomUser(AbstractUser) :
    role_choices = [('DisOff', 'DistrictOfficial'), ('StOff', 'StateOfficial'), ('A', 'Administrator')]
    role = models.CharField(max_length=10, choices=role_choices, default='DisCol')
    objects = CustomUserManager()

    def __str__(self):
        return (self.username)


"""class DistrictOfficialProfile(models.Model) :
    account = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="district_official_profile", limit_choices_to={'role' : 'DisOff'})
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='district_official_profile')
    state = models.ForeignKey(State, on_delete=models.CASCADE)

    def __str__(self):
        namestring = self.account.first_name + ' ' + self.account.last_name + ' - ' + self.district.name + ' - ' + self.state.name
        return namestring


class StateOfficialProfile(models.Model) :
    account = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="state_official_profile", limit_choices_to={'role' : 'StOff'})
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='state_official_profile')

    def __str__(self):
        namestring = self.account.first_name + ' ' + self.account.last_name + ' - ' + self.state.name
        return namestring"""