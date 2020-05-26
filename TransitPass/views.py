from django.shortcuts import render, redirect
from .models import TransitPassApplication, State, District, TransitPass
from django.core.files.storage import FileSystemStorage
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.db import models
from django.core.mail import send_mail
import datetime
import Savior19.settings as settings


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
			status = 'A',
			vehicle_type = request.POST['vehicle_type'],
			vehicle_no = request.POST['vehicle_no']
		)
		# Render a new application form.
		return redirect(DisplayApplicationToken, transit_pass_application_object.id)
	
	else :
		# Render an application form.
		states = State.objects.all()
		districts = District.objects.all()
		return render(request, 'TransitPass/apply.html', {'states' : states, 'districts' : districts})


def DisplayApplicationToken(request, appln_id) :
	application_object = TransitPassApplication.objects.get(id=appln_id)
	return render(request, 'TransitPass/applicationSuccessful.html', {'application' : application_object})


# ---------------------------------------------------------- Government Official's Pages -----------------------------------------------------------


@login_required
def DisplayApplicationList(request) :
	# Change the status of expired pass.
	expired_passes = TransitPass.objects.filter(expiry_date__lt=datetime.datetime.today())
	for expired_pass in expired_passes :
		expired_pass.status = 'E'
	
	if request.user.role == 'DisOff' :
		# District level official
		valid_application_objects = TransitPassApplication.objects.filter(models.Q(district=request.user.district_official_profile.get().district) & (models.Q(status='A') | models.Q(status='CL')))
	elif request.user.role == 'StOff' :
		# State level Official
		valid_application_objects = TransitPassApplication.objects.filter(models.Q(state=request.user.state_official_profile.get().state) & (models.Q(status='A') | models.Q(status='CL')))
	else :
		raise PermissionDenied()
	
	num_applications = len(valid_application_objects)
	context = {'applications' : valid_application_objects, 'num_applications' : num_applications}
	return render(request, 'TransitPass/submittedApplicationList.html', context)


@login_required
def DisplayIndividualApplication(request, appln_id) :
	# Change the status of expired pass.
	expired_passes = TransitPass.objects.filter(expiry_date__lt=datetime.datetime.today())
	for expired_pass in expired_passes :
		expired_pass.status = 'E'

	application_object = TransitPassApplication.objects.get(id=appln_id)
	if application_object.status in ['AC', 'R'] :
		# Officials cannot modify the status of accepted or rejected applications
		raise PermissionDenied()
	if request.method == 'POST' :
		if (
			(request.user.role == 'DisOff' and request.user.district_official_profile.get().district == application_object.district)
			or (request.user.role == 'StOff' and request.user.state_official_profile.get().state == application_object.state)
			) :
			modified_status = request.POST['status']
			application_object.status = modified_status
			application_object.save()
			if application_object.status == 'AC' :
				# If application is accepted.
				pass_object = TransitPass.objects.create(
					application=application_object,
					authorizer=request.user,
					expiry_date=request.POST['expiry']
				)
				# Send a application accepted successfuly email to the user.
				print('An email has been send to the applicant with the details of the pass.')
				mail_subject = 'Savior-19 -  Your Transit Pass Application has been accepted'
				mail_body = f"Dear {application_object.full_name}, \n \
					Your application for transit pass with application number {application_object.id} has been approved successfully. \n \
					Kindly note down the following details reguarding your pass. \n \
					Pass ID : {pass_object.id} \n \
					Pass Expiry date : {pass_object.expiry_date} \n \
					Thanking You \n \
					Savior 19"
				send_mail(mail_subject, mail_body, settings.EMAIL_HOST_USER, [str(application_object.email)], fail_silently=False)
				return redirect(DisplayApplicationList)
			elif application_object.status == 'CL' :
				# If the application needs more clarifications
				comments = request.POST['comments']
				mail_subject = 'Savior-19 -  Your Transit Pass Application needs more details'
				mail_body = f"Dear {application_object.full_name}, \n  \
					Your application for transit pass with application number {application_object.id} has been put on hold. \n \
					Please note down the additional details that is required to process your application. \n \
					{comments} \n \
					Thanking You \n \
					Savior 19"
				send_mail(mail_subject, mail_body, settings.EMAIL_HOST_USER, [str(application_object.email)], fail_silently=False)
				print('sent mail')
				return redirect(DisplayApplicationList)
			else :
				# If the application has been rejected
				# Send a mail stating the rejection issue
				comments = request.POST['comments']
				mail_subject = 'Savior-19 -  Your Transit Pass Application has been Rejected'
				mail_body = f"Dear {application_object.full_name}, \n \
					Your application for transit pass with application number {application_object.id} has been rejected due to the following reasons. \n \
					{comments} \n \
					Thanking You \n \
					Savior 19"
				send_mail(mail_subject, mail_body, settings.EMAIL_HOST_USER, [str(application_object.email)], fail_silently=False)
				return redirect(DisplayApplicationList)
		else :
			raise PermissionDenied()
	else :
		if request.user.role == 'DisOff' :
			if request.user.district_official_profile.get().district == application_object.district :
				return render(request, 'TransitPass/individualApplication.html', {'application' : application_object})
			else :
				raise PermissionDenied()
		elif request.user.role == 'StOff' :
			if request.user.state_official_profile.get().state == application_object.state :
				return render(request, 'TransitPass/individualApplication.html', {'application' : application_object})
			else :
				raise PermissionDenied()
		else :
			raise PermissionDenied()


"""@login_required
def SendClarificationMail(request, appln_id) :
	# Change the status of expired pass.
	expired_passes = TransitPass.objects.filter(expiry_date__lt=datetime.datetime.today())
	for expired_pass in expired_passes :
		expired_pass.status = 'E'

	application_object = TransitPassApplication.objects.get(id=appln_id)
	if application_object.status in ['AC', 'R'] :
		# Officials cannot modify the status of accepted or rejected applications
		raise PermissionDenied()
	if (
		(request.user.role == 'DisOff' and request.user.district_official_profile.get().district == application_object.district)
		or (request.user.role == 'StOff' and request.user.state_official_profile.get().state == application_object.state)
		) :
		if request.method == 'POST' :
			# Send a email to the user stating the clarifications needed.
			print('An email has been send to the applicant with the details of the clarifications needed.')
			choice = request.POST['choice']
			if choice == 'A' :
				message = 'Your aadhaar card is invalid'
			elif choice == 'B' :
				message = 'The Identification document submitted is insufficient/invalid'
			message += request.POST['additional-message']

			return redirect(DisplayApplicationList)
		else :
			return render(request, 'TransitPass/sendClarification.html')
	else :
		raise PermissionDenied()"""


def CheckApplicationStatus(request) :
	# Change the status of expired pass.
	expired_passes = TransitPass.objects.filter(expiry_date__lt=datetime.datetime.today())
	for expired_pass in expired_passes :
		expired_pass.status = 'E'
	
	if request.method == 'POST' :
		appln_id = request.POST['appln_id']
		mobile_number = request.POST['mobile_number']
		try :
			application_object = TransitPassApplication.objects.get(id=appln_id, mobile=mobile_number)
		except :
			return render(request, 'TransitPass/checkApplicationStatus.html', {'output' : True, 'error' : True})
		else :
			return render(request, 'TransitPass/checkApplicationStatus.html', {'output' : True, 'error' : False, 'application' : application_object})
	else :
		return render(request, 'TransitPass/checkApplicationStatus.html', {'output' : False})


def CheckPassValidity(request) :
	# Change the status of expired pass.
	expired_passes = TransitPass.objects.filter(expiry_date__lt=datetime.datetime.today())
	for expired_pass in expired_passes :
		expired_pass.status = 'E'
	
	if request.method == 'POST' :
		pass_id = request.POST['pass_id']
		mobile_number = request.POST['mobile_number']
		try :
			pass_object = TransitPass.objects.get(id=pass_id)
			if pass_object.application.mobile == int(mobile_number) :
				return render(request, 'TransitPass/checkPassValidity.html', {'output' : True, 'error' : False, 'transit_pass' : pass_object})
			else :
				return render(request, 'TransitPass/checkPassValidity.html', {'output' : True, 'error' : True})
		except :
			return render(request, 'TransitPass/checkPassValidity.html', {'output' : True, 'error' : True})
	else :
		return render(request, 'TransitPass/checkPassValidity.html', {'output' : False})