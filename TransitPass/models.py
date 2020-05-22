from django.db import models
from django.core.exceptions import ValidationError


class State(models.Model) :
    name = models.CharField(max_length=30)

    class Meta() :
        verbose_name = 'State'
        verbose_name_plural = 'States'
    
    def __str__(self):
        return self.name


class District(models.Model) :
    name = models.CharField(max_length=30)
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='districts_in_state')

    class Meta() :
        verbose_name = 'District'
        verbose_name_plural = 'Districts'
    
    def __str__(self):
        return self.name + ' - ' + self.state.name


def aadhaar_validator(aadhaarNum) :
    """
    Takes a N digit aadhar number and
    returns a boolean value whether that is Correct or Not
    """
    verhoeff_table_d = (
        (0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        (1, 2, 3, 4, 0, 6, 7, 8, 9, 5),
        (2, 3, 4, 0, 1, 7, 8, 9, 5, 6),
        (3, 4, 0, 1, 2, 8, 9, 5, 6, 7),
        (4, 0, 1, 2, 3, 9, 5, 6, 7, 8),
        (5, 9, 8, 7, 6, 0, 4, 3, 2, 1),
        (6, 5, 9, 8, 7, 1, 0, 4, 3, 2),
        (7, 6, 5, 9, 8, 2, 1, 0, 4, 3),
        (8, 7, 6, 5, 9, 3, 2, 1, 0, 4),
        (9, 8, 7, 6, 5, 4, 3, 2, 1, 0))

    verhoeff_table_p = (
        (0, 1, 2, 3, 4, 5, 6, 7, 8, 9),
        (1, 5, 7, 6, 2, 8, 3, 0, 9, 4),
        (5, 8, 0, 3, 7, 9, 6, 1, 4, 2),
        (8, 9, 1, 6, 0, 4, 3, 5, 2, 7),
        (9, 4, 5, 3, 1, 2, 6, 8, 7, 0),
        (4, 2, 8, 6, 5, 7, 3, 9, 0, 1),
        (2, 7, 9, 3, 8, 0, 6, 4, 1, 5),
        (7, 0, 4, 6, 9, 1, 3, 2, 5, 8))

    # verhoeff_table_inv = (0, 4, 3, 2, 1, 5, 6, 7, 8, 9)

    def checksum(s: str) -> int:
        """For a given number generates a Verhoeff digit and
        returns number + digit"""
        c = 0
        for i, item in enumerate(reversed(s)):
            c = verhoeff_table_d[c][verhoeff_table_p[i % 8][int(item)]]
        return c

    # Validate Verhoeff checksum
    aadhaarNum = str(aadhaarNum)
    if not( checksum(aadhaarNum) == 0 and len(aadhaarNum) == 12 ) :
        raise ValidationError(f"{aadhaarNum} is not a valid Aadhaar Number.")


class TransitPassApplication(models.Model) :
    full_name = models.CharField(max_length=200, blank=False, null=False)
    email = models.EmailField(max_length=100, blank=False, null=False)
    age = models.IntegerField(default=0)
    mobile = models.BigIntegerField(verbose_name="Mobile number", unique=True, blank=False, null=False)
    applicant_type = models.CharField(max_length=5, choices=[('Pvt', 'Private'), ('Govt', 'Government'), ('Pub', 'Public')])
    aadhaar_number = models.BigIntegerField(verbose_name="Aadhaar Number", validators=[aadhaar_validator])
    address = models.TextField(verbose_name="House Address", max_length=500)
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='transit_pass_appln_for_state')
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='transit_pass_appln_for_district')
    purpose = models.TextField(max_length=5000, verbose_name="Purpose for travel")
    source = models.CharField(max_length=100, verbose_name="Source Area")
    destination = models.CharField(max_length=100, verbose_name="Destination Area")
    #doj = models.DateField(verbose_name="Date of Journey", auto_now=True)
    document = models.FileField(verbose_name="Suppporting Documents", blank=True)
    STATUS_CHOICES = [('A', 'APPLIED'), ('CL', 'CLARIFICATIONS REQUIRED'), ('AC', 'ACCEPTED'), ('R', 'REJECTED')]
    status = models.CharField(max_length=5, verbose_name='Application Status', choices=STATUS_CHOICES, default='A')
    #VEHICLE_CHOICES = [('T', 'TWO WHEELER'), ('F', 'FOUR WHEELER')]
    #vehicle_type = models.CharField(max_length=5, verbose_name='Vehicle Type', choices=VEHICLE_CHOICES, default='T')
    #vehicle_no = models.CharField(max_length=15, verbose_name='Vehicle Registration Number')

    class Meta() :
        verbose_name = "Transit Pass Application"
        verbose_name_plural = "Transit Pass Applications"
    
    def __str__(self) :
        name_string = self.full_name + " - " + self.district.name + " - " + self.state.name
        return name_string
    
    def delete(self, *args, **kwargs) :
        self.document.delete()
        super().delete(*args, **kwargs)


class TransitPass(models.Model) :
    application = models.ForeignKey(TransitPassApplication, on_delete=models.SET_NULL, related_name='transit_pass_object', null=True)
    authorizer = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, limit_choices_to = models.Q(role='DisOff') | models.Q(role='StOff'))
    issue_date = models.DateField(verbose_name='Date Of Issue', auto_now=True)
    expiry_date = models.DateField(verbose_name='Valid Upto')
    STATUS_CHOICES = [('A', 'ACTIVE'), ('E', 'EXPIRED')]
    status = models.CharField(max_length=5, verbose_name='Pass Status', choices=STATUS_CHOICES, default='A')

    class Meta() :
        verbose_name = 'Transit Pass'
        verbose_name_plural = 'Transit Passes'
    
    def __str__(self):
        return self.application.full_name + str(self.expiry_date)