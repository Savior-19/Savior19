from django.shortcuts import render
from .models import TransitPassApplication, State, District
from django.core.files.storage import FileSystemStorage


# ---------------------------------------------------------- Customer Pages -----------------------------------------------------------

def FillPassApplication(request) :
	if request.method == 'POST' :
		# Get the state object.
		state_name = request.POST['state']
		state_object = State.objects.get(name=state_name)
		district_name = request.POST['district']
		district_object = District.objects.get(name=district_name)
		# Create an object for the application.
		transit_pass_application_object = TransitPassApplication.objects.create(
			full_name = request.POST['full_name'],
			email = request.POST['email'],
			age = request.POST['age'],
			mobile = request.POST['mobile'],
			applicant_type = request.POST['applicant_type'],
			aadhaar_number = request.POST['aadhaar_number'],
			address = request.POST['address'],
			state = state_object,
			district = district_object,
			purpose = request.POST['purpose'],
			source = request.POST['source'],
			destination = request.POST['destination'],
			document = request.FILES['document'],
			status = 'A'
		)
		# Render a new application form.
		return render(request, 'TransitPass/apply.html')
	
	else :
		# Render an application form.
		return render(request, 'TransitPass/apply.html')


# ---------------------------------------------------------- Government Official's Pages -----------------------------------------------------------


