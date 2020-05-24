/**
 *
 * main() will be run when you invoke this action
 *
 * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
 *
 * @return The output of this action, which must be a JSON object.
 *
 */
var request = require("request-promise");
const DiscoveryV1 = require("watson-developer-cloud/discovery/v1");
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * 
 * statesi is the dictionary containing the value of the states of India in formatted form and value as a Camel Cased form 
 * It is used to check whether the location that is entered is a state or not
 * 
 * District is a dictionary with formatted district of India as a key and it's corresponding state as the value
 * It is used to know which state the district corresponds to and  also whether a location is district or not.
 * 
 */
const statesi = {
    Andaman_and_Nicobar_Islands: "Andaman and Nicobar Islands",
    Andhra_Pradesh: "Andhra Pradesh",
    Arunachal_Pradesh: "Arunachal Pradesh",
    Assam :"Assam",
    Bihar: "Bihar",
    Chandigarh: "Chandigarh",
    Chattisgarh: "Chhattisgarh",
    Delhi: "Delhi",
    Dadra_and_Nagar_Haveli_and_Daman_Diu: "Dadra and Nagar Haveli and Daman and Diu",
    Goa: "Goa",
    Gujarat: "Gujarat",
    Himachal_Pradesh: "Himachal Pradesh",
    Haryana: "Haryana",
    Jharkhand: "Jharkhand",
    Jammu_and_Kashmir: "Jammu and Kashmir",
    Karnataka: "Karnataka",
    Kerala: "Kerala",
    Ladakh: "Ladakh",
    Maharashtra: "Maharashtra",
    Meghalaya: "Meghalaya",
    Manipur: "Manipur",
    Madhya_Pradesh: "Madhya Pradesh",
    Mizoram: "Mizoram",
    Odisha: "Odisha",
    Punjab: "Punjab",
    Puducherry: "Puducherry",
    Rajasthan: "Rajasthan",
    Telangana: "Telangana",
    Tamil_Nadu: "Tamil Nadu",
    Tripura: "Tripura",
    Uttar_Pradesh: "Uttar Pradesh",
    Uttarakhand: "Uttarakhand",
    West_Bengal: "West Bengal"
};
const District = {
Malda  : "West Bengal",
Uttar_Dinajpur : "West Bengal",
Dakshin_Dinajpur : "West Bengal",
Murshidabad : "West Bengal",
Birbhum : "West Bengal",
Hooghly : "West Bengal",
Paschim_Bardhaman : "West Bengal",
Purba_Bardhaman : "West Bengal",
Alipurduar : "West Bengal",
Cooch_Behar : "West Bengal",
Darjeeling : "West Bengal",
Jalpaiguri : "West Bengal",
Kalimpong : "West Bengal",
Howrah : "West Bengal",
Kolkata : "West Bengal",
Nadia : "West Bengal",
North_24_Parganas : "West Bengal",
South_24_Parganas : "West Bengal",
Bankura : "West Bengal",
Jhargram : "West Bengal",
Purulia : "West Bengal",
Purba_Medinipur : "West Bengal",
Paschim_Medinipur : "West Bengal",
Almora : "Uttarakhand",
Bageshwar : "Uttarakhand",	
Chamoli_Gopeshwar  : "Uttarakhand",
Champawat : "Uttarakhand",
Dehradun	: "Uttarakhand",
Haridwar	: "Uttarakhand",
Nainital	: "Uttarakhand",
Pauri_Garhwal	: "Uttarakhand",
Pithoragarh	: "Uttarakhand",
Rudraprayag	: "Uttarakhand",
Tehri_Garhwal : "Uttarakhand",
Udham_Singh_Nagar  : "Uttarakhand",
Uttarkashi : "Uttarakhand",
Agra : "Uttar Pradesh",
Firozabad  : "Uttar Pradesh",
Mainpuri : "Uttar Pradesh",
Mathura	 : "Uttar Pradesh",
Aligarh : "Uttar Pradesh",
Etah : "Uttar Pradesh",
Hathras : "Uttar Pradesh",
Kasganj : "Uttar Pradesh",
Allahabaad : "Uttar Pradesh",
Fatehpur : "Uttar Pradesh",
Kaushambi : "Uttar Pradesh",
Pratapgarh : "Uttar Pradesh",
Azamgarh : "Uttar Pradesh",
Ballia : "Uttar Pradesh",
Mau : "Uttar Pradesh",
Budaun : "Uttar Pradesh",
Bareilly : "Uttar Pradesh",
Pilibhit : "Uttar Pradesh",
Shahjahanpur : "Uttar Pradesh",
Basti : "Uttar Pradesh",
Sant_Kabir_Nagar : "Uttar Pradesh",
Siddharthnagar : "Uttar Pradesh",
Banda : "Uttar Pradesh",
Chitrakoot : "Uttar Pradesh",
Hamirpur : "Uttar Pradesh",
Mahoba	 : "Uttar Pradesh",
Bahraich : "Uttar Pradesh",
Balarampur : "Uttar Pradesh",
Gonda : "Uttar Pradesh",
Shravasti : "Uttar Pradesh",
Ambedkar_Nagar : "Uttar Pradesh",
Amethi : "Uttar Pradesh",
Barabanki : "Uttar Pradesh",
Faizabad : "Uttar Pradesh",
Sultanpur : "Uttar Pradesh",
Deoria : "Uttar Pradesh",
Gorakhpur : "Uttar Pradesh",
Kushinagar : "Uttar Pradesh",
Maharajganj : "Uttar Pradesh",
Jalaun : "Uttar Pradesh",
Jhansi : "Uttar Pradesh",
Lalitpur : "Uttar Pradesh",
Auraiya : "Uttar Pradesh",
Etawah : "Uttar Pradesh",
Farrukhabad : "Uttar Pradesh",
Kannauj : "Uttar Pradesh",
Kanpur_Dehat : "Uttar Pradesh",
Kanpur_Nagar : "Uttar Pradesh",
Hardoi : "Uttar Pradesh",
Lakhimpur_Kheri : "Uttar Pradesh",
Lucknow : "Uttar Pradesh",
Raebareli : "Uttar Pradesh",
Sitapur : "Uttar Pradesh",
Unnao : "Uttar Pradesh",
Bagpat : "Uttar Pradesh",
Bulandshahr : "Uttar Pradesh",
Gautam_Buddha_Nagar : "Uttar Pradesh",
Ghaziabad : "Uttar Pradesh",
Hapur : "Uttar Pradesh",
Meerut : "Uttar Pradesh",
Mirzapur : "Uttar Pradesh",
Sant_Ravidas_Nagar : "Uttar Pradesh",
Sonbhadra : "Uttar Pradesh",
Amroha : "Uttar Pradesh",
Bijnor : "Uttar Pradesh",
Moradabad : "Uttar Pradesh",
Rampur : "Uttar Pradesh",
Sambhal : "Uttar Pradesh",
Muzaffarnagar : "Uttar Pradesh",
Saharanpur : "Uttar Pradesh",
Shamli : "Uttar Pradesh",
Chandauli : "Uttar Pradesh",
Ghazipur : "Uttar Pradesh",
Jaunpur : "Uttar Pradesh",
Varanasi : "Uttar Pradesh",
Dhalai  : "Tripura",
South_Tripura  : "Tripura",
Gomati  : "Tripura",
North_Tripura  : "Tripura",
Sipahijala  : "Tripura",
Khowai  : "Tripura",
West_Tripura  : "Tripura",
Unakoti  : "Tripura",
Chennai : "Tamil Nadu",
Madurai : "Tamil Nadu",
Namakkal : "Tamil Nadu",
Thanjavur : "Tamil Nadu",
Chengalpattu : "Tamil Nadu",
Thiruvallur : "Tamil Nadu",
Tiruppur : "Tamil Nadu",
Rani_Pet : "Tamil Nadu",
Virudhunagar : "Tamil Nadu",
Thiruvarur : "Tamil Nadu",
Vellore : "Tamil Nadu",
Kanchipuram : "Tamil Nadu",
Theni : "Tamil Nadu",
Tenkasi : "Tamil Nadu",
Nagapattinam : "Tamil Nadu",
Dindigul : "Tamil Nadu",
Villupuram : "Tamil Nadu",
Coimbatore : "Tamil Nadu",
Cuddalore : "Tamil Nadu",
Salem : "Tamil Nadu",
Karur : "Tamil Nadu",
Tuticorin : "Tamil Nadu",
Tiruchirappalli : "Tamil Nadu",
Tirupathur : "Tamil Nadu",
Kanniyakumari : "Tamil Nadu",
Tiruvannamalai : "Tamil Nadu",
Ramanathapuram : "Tamil Nadu",
Tirunelveli : "Tamil Nadu",
The_Nilgiris : "Tamil Nadu",
Sivaganga : "Tamil Nadu",
Perambalur : "Tamil Nadu",
Kallakurichi : "Tamil Nadu",
Ariyalur : "Tamil Nadu",
Erode : "Tamil Nadu",
Pudukkottai : "Tamil Nadu",
Dharmapuri : "Tamil Nadu",
Krishnagiri : "Tamil Nadu",
South_Andamans : "Andaman And Nicobar Islands",
Nicobars : "Andaman And Nicobar Islands",
North_And_Middle_Andaman :"Andaman And Nicobar Islands",
Kurnool : "Andhra Pradesh",
Guntur : "Andhra Pradesh",
Krishna : "Andhra Pradesh",
Chittoor : "Andhra Pradesh",
Spsr_Nellore : "Andhra Pradesh",
West_Godavari : "Andhra Pradesh",
Ysr : "Andhra Pradesh",
Anantapur : "Andhra Pradesh",
Prakasam : "Andhra Pradesh",
East_Godavari : "Andhra Pradesh",
Srikakulam : "Andhra Pradesh",
Visakhapatanam : "Andhra Pradesh",
Vizianagaram : "Andhra Pradesh",
Lohit : "Arunachal Pradesh",
Changlang : "Arunachal Pradesh",
Dibang_Valley : "Arunachal Pradesh",
East_Kameng : "Arunachal Pradesh",
East_Siang : "Arunachal Pradesh",
Kurungkumey : "Arunachal Pradesh",
Lower_Dibang_Valley : "Arunachal Pradesh",
Lower_Subansiri : "Arunachal Pradesh",
Papum_Pare : "Arunachal Pradesh",
Tawang : "Arunachal Pradesh",
Tirap : "Arunachal Pradesh",
Upper_Siang : "Arunachal Pradesh",
Upper_Subansiri : "Arunachal Pradesh",
West_Kameng : "Arunachal Pradesh",
West_Siang : "Arunachal Pradesh",
Anjaw : "Arunachal Pradesh",
Longding : "Arunachal Pradesh",
Kradaadi : "Arunachal Pradesh",
Namsai : "Arunachal Pradesh",
Siang : "Arunachal Pradesh",
Kamle : "Arunachal Pradesh",
Lower_Siang : "Arunachal Pradesh",
Pakkekessang : "Arunachal Pradesh",
Leparada : "Arunachal Pradesh",
Shi_Yomi : "Arunachal Pradesh",
Dhubri : "Assam",
Marigaon : "Assam",
Goalpara : "Assam",
Golaghat : "Assam",
Karimganj : "Assam",
Nalbari : "Assam",
Hailakandi : "Assam",
Cachar : "Assam",
Kamrup : "Assam",
Lakhimpur : "Assam",
Kamrup_Metro : "Assam",
South_Salmaramancachar : "Assam",
Barpeta : "Assam",
Bongaigaon : "Assam",
Darrang : "Assam",
Dhemaji : "Assam",
Dibrugarh : "Assam",
Jorhat : "Assam",
Karbianglong : "Assam",
Kokrajhar : "Assam",
Nagaon : "Assam",
Dima_Hasao : "Assam",
Sivasagar : "Assam",
Sonitpur : "Assam",
Tinsukia : "Assam",
Chi_Rang : "Assam",
Baksa : "Assam",
Udalguri : "Assam",
Biswanath : "Assam",
Majuli : "Assam",
Charaideo : "Assam",
Hojai : "Assam",
West_Karbianglong : "Assam",
Munger : "Bihar",
Patna : "Bihar",
Rohtas : "Bihar",
Buxar : "Bihar",
Gaya : "Bihar",
Nalanda : "Bihar",
Kaimur : "Bihar",
Siwan : "Bihar",
Gopalganj : "Bihar",
Bhojpur : "Bihar",
Begusarai : "Bihar",
Aurangabad : "Bihar",
Madhubani : "Bihar",
Purbi_Champaran : "Bihar",
Bhagalpur : "Bihar",
Arwal : "Bihar",
Saran : "Bihar",
Nawada : "Bihar",
Lakhisarai : "Bihar",
Banka : "Bihar",
Vaishali : "Bihar",
Darbhanga : "Bihar",
Jehanabad : "Bihar",
Madhepura : "Bihar",
Purnia : "Bihar",
Sheikhpura : "Bihar",
Araria : "Bihar",
Jamui : "Bihar",
Katihar : "Bihar",
Khagaria : "Bihar",
Kishanganj : "Bihar",
Muzaffarpur : "Bihar",
Pashchim_Champaran : "Bihar",
Saharsa : "Bihar",
Samastipur : "Bihar",
Sheohar : "Bihar",
Sitamarhi : "Bihar",
Supaul : "Bihar",
Chandigarh : "Chandigarh",
Raipur : "Chhattisgarh",
Korba : "Chhattisgarh",
Surajpur : "Chhattisgarh",
Bilaspur : "Chhattisgarh",
Durg : "Chhattisgarh",
Rajnandgaon : "Chhattisgarh",
Ba_Star : "Chhattisgarh",
Dantewada : "Chhattisgarh",
Dhamtari : "Chhattisgarh",
Janjgir_Champa : "Chhattisgarh",
Jashpur : "Chhattisgarh",
Kanker : "Chattisgarh",
Kabirdham : "Chhattisgarh",
Korea : "Chhattisgarh",
Mahasamund : "Chhattisgarh",
Raigarh : "Chhattisgarh",
Surguja : "Chhattisgarh",
Bijapur : "Chhattisgarh",
Narayanpur : "Chhattisgarh",
Sukma : "Chhattisgarh",
Kondagaon : "Chhattisgarh",
Baloda_Bazar : "Chhattisgarh",
Gariyaband : "Chhattisgarh",
Balod : "Chhattisgarh",
Mungeli : "Chhattisgarh",
Balrampur : "Chhattisgarh",
Bemetara : "Chhattisgarh",
Daman  : "Dadra and Nagar Haveli and Daman and Diu",
Diu  : "Dadra and Nagar Haveli and Daman and Diu",
Dadra_and_Nagar_Haveli  : "Dadra and Nagar Haveli and Daman and Diu",
South_East_Delhi : "Delhi",
Central_Delhi : "Delhi",
North_Delhi : "Delhi",
South_Delhi : "Delhi",
North_East_Delhi : "Delhi",
West_Delhi : "Delhi",
Shahdara : "Delhi",
East_Delhi : "Delhi",
New_Delhi : "Delhi",
North_West_Delhi : "Delhi",
South_West_Delhi : "Delhi",
North_Goa : "Goa",
South_Goa : "Goa",
Ahmadabad : "Gujarat",
Surat : "Gujarat",
Vadodara : "Gujarat",
Anand : "Gujarat",
Banas_Kantha : "Gujarat",
Panch_Mahals : "Gujarat",
Bhavnagar : "Gujarat",
Gandhinagar : "Gujarat",
Arvaiii : "Gujarat",
Rajkot : "Gujarat",
Bharuch : "Gujarat",
Botad : "Gujarat",
Narmada : "Gujarat",
Chhotaudepur : "Gujarat",
Mahisagar : "Gujarat",
Mahesana : "Gujarat",
Patan : "Gujarat",
Kheda : "Gujarat",
Valsad : "Gujarat",
Dohad : "Gujarat",
Kachchh : "Gujarat",
Navsari : "Gujarat",
Girsomnath : "Gujarat",
Dang : "Gujarat",
Sabarkantha : "Gujarat",
Tapi : "Gujarat",
Jamnagar : "Gujarat",
Surendranagar : "Gujarat",
Morbi : "Gujarat",
Amreli : "Gujarat",
Porbandar : "Gujarat",
Junagadh : "Gujarat",
Devbhumi_Dwarka : "Gujarat",
Sonipat : "Haryana",
Faridabad : "Haryana",
Gurugram : "Haryana",
Nuh : "Haryana",
Panipat : "Haryana",
Panchkula : "Haryana",
Palwal : "Haryana",
Rohtak : "Haryana",
Hisar : "Haryana",
Ambala : "Haryana",
Jhajjar : "Haryana",
Bhiwani : "Haryana",
Kaithal : "Haryana",
Kurukshetra : "Haryana",
Karnai : "Haryana",
Jind : "Haryana",
Sirsa : "Haryana",
Yamunanagar : "Haryana",
Fatehabad : "Haryana",
Charki_Dadri : "Haryana",
Mahendragarh : "Haryana",
Rewari : "Haryana",
Una : "Himachal Pradesh",
Chamba : "Himachal Pradesh",
Hamirpur : "Himachal Pradesh",
Kangra : "Himachal Pradesh",
Sirmaur : "Himachal Pradesh",
Solan : "Himachal Pradesh",
Bilaspur : "Himachal Pradesh",
Kinnaur : "Himachal Pradesh",
Kullu : "Himachal Pradesh",
Lahul_And_Spiti : "Himachal Pradesh",
Mandi : "Himachal Pradesh",
Shimla : "Himachal Pradesh",
Bandipora : "Jammu and Kashmir",
Shopian : "Jammu and Kashmir",
Anantnag : "Jammu and Kashmir",
Srinagar : "Jammu and Kashmir",
Baramulla : "Jammu and Kashmir",
Kupwara : "Jammu and Kashmir",
Ganderbal : "Jammu and Kashmir",
Jammu : "Jammu and Kashmir",
Udhampur : "Jammu and Kashmir",
Kulgam : "Jammu and Kashmir",
Budgam : "Jammu and Kashmir",
Samba : "Jammu and Kashmir",
Kathua : "Jammu and Kashmir",
Rajouri : "Jammu and Kashmir",
Ramban : "Jammu and Kashmir",
Reasi : "Jammu and Kashmir",
Pulwama : "Jammu and Kashmir",
Kishtwar : "Jammu and Kashmir",
Doda : "Jammu and Kashmir",
Poonch : "Jammu and Kashmir",
Ranchi : "Jharkhand",
Bokaro : "Jharkhand",
Garhwa : "Jharkhand",
Dhanbad : "Jharkhand",
Deoghar : "Jharkhand",
Hazaribagh : "Jharkhand",
Simdega : "Jharkhand",
Giridih : "Jharkhand",
Koderma : "Jharkhand",
Jamtara : "Jharkhand",
Chatra : "Jharkhand",
Dumka : "Jharkhand",
East_Singhbum : "Jharkhand",
Godda : "Jharkhand",
Gumla : "Jharkhand",
Latehar : "Jharkhand",
Lohardaga : "Jharkhand",
Pakur : "Jharkhand",
Palamu : "Jharkhand",
Sahebganj : "Jharkhand",
Saraikela_Kharsawan : "Jharkhand",
West_Singhbhum : "Jharkhand",
Khunti : "Jharkhand",
Ramgarh : "Jharkhand",
Bengaluru_Urban : "Karnataka",
Mysuru : "Karnataka",
Bengaluru_Rural : "Karnataka",
Belagavi : "Karnataka",
Vijayapura : "Karnataka",
Kalaburagi : "Karnataka",
Bagalkote : "Karnataka",
Mandya : "Karnataka",
Ballari : "Karnataka",
Dharwad : "Karnataka",
Dakshina_Kannada : "Karnataka",
Bidar : "Karnataka",
Chikkaballapura : "Karnataka",
Gadag : "Karnataka",
Uttara_Kannada : "Karnataka",
Tumakuru : "Karnataka",
Davangere : "Karnataka",
Udupi : "Karnataka",
Chamarajanagara : "Karnataka",
Chikkamagaluru : "Karnataka",
Chitradurga : "Karnataka",
Hassan : "Karnataka",
Haveri : "Karnataka",
Kodagu : "Karnataka",
Kolar : "Karnataka",
Koppal : "Karnataka",
Raichur : "Karnataka",
Shivamogga : "Karnataka",
Ramanagara : "Karnataka",
Yadgir : "Karnataka",
Kannur : "Kerala",
Kottayam : "Kerala",
Kasaragod : "Kerala",
Ldukki : "Kerala",
Kozhikode : "Kerala",
Kollam : "Kerala",
Palakkad : "Kerala",
Pathanamthitta : "Kerala",
Malappuram : "Kerala",
Thiruvananthapuram : "Kerala",
Alappuzha : "Kerala",
Thrissur : "Kerala",
Ernakulam : "Kerala",
Wayanad : "Kerala",
Lehladakh : "Ladakh",
Kargil : "Ladakh",
Lakshadweep_District : "Lakshadweep",
Indore : "Madhya Pradesh",
Bhopal : "Madhya Pradesh",
Ujjain : "Madhya Pradesh",
Jabalpur : "Madhya Pradesh",
Dhar : "Madhya Pradesh",
Barwani : "Madhya Pradesh",
East_Nimar : "Madhya Pradesh",
Dewas : "Madhya Pradesh",
Gwalior : "Madhya Pradesh",
Khargone : "Madhya Pradesh",
Raisen : "Madhya Pradesh",
Hoshangabad : "Madhya Pradesh",
Ratlam : "Madhya Pradesh",
Agar_Malwa : "Madhya Pradesh",
Mandsaur : "Madhya Pradesh",
Sagar : "Madhya Pradesh",
Shajapur : "Madhya Pradesh",
Chhindwara : "Madhya Pradesh",
Alirajpur : "Madhya Pradesh",
Tikamgarh : "Madhya Pradesh",
Shahdol : "Madhya Pradesh",
Sheopur : "Madhya Pradesh",
Dindori : "Madhya Pradesh",
Burhanpur : "Madhya Pradesh",
Harda : "Madhya Pradesh",
Betul : "Madhya Pradesh",
Vidisha : "Madhya Pradesh",
Morena : "Madhya Pradesh",
Rewa : "Madhya Pradesh",
Ashoknagar : "Madhya Pradesh",
Rajgarh : "Madhya Pradesh",
Shivpuri : "Madhya Pradesh",
Anuppur : "Madhya Pradesh",
Balaghat : "Madhya Pradesh",
Bhind : "Madhya Pradesh",
Chhatarpur : "Madhya Pradesh",
Damoh : "Madhya Pradesh",
Datia : "Madhya Pradesh",
Guna : "Madhya Pradesh",
Jhabua : "Madhya Pradesh",
Katni : "Madhya Pradesh",
Mandia : "Madhya Pradesh",
Narsinghpur : "Madhya Pradesh",
Neemuch : "Madhya Pradesh",
Panna : "Madhya Pradesh",
Satna : "Madhya Pradesh",
Sehore : "Madhya Pradesh",
Seoni : "Madhya Pradesh",
Sidhi : "Madhya Pradesh",
Umaria : "Madhya Pradesh",
Singrauli : "Madhya Pradesh",
Niwari : "Madhya Pradesh",
Mumbai : "Maharashtra",
Pune : "Maharashtra",
Thane : "Maharashtra",
Nashik : "Maharashtra",
Palghar : "Maharashtra",
Nagpur : "Maharashtra",
Solapur : "Maharashtra",
Yavatmal : "Maharashtra",
Aurangabad : "Maharashtra",
Satara : "Maharashtra",
Dhule : "Maharashtra",
Akola : "Maharashtra",
Jalgaon : "Maharashtra",
Mumbai_Suburban : "Maharashtra",
Raigad : "Maharashtra",
Ahmednagar : "Maharashtra",
Amravati : "Maharashtra",
Buldhana : "Maharashtra",
Nandurbar : "Maharashtra",
Kolhapur : "Maharashtra",
Hingoli : "Maharashtra",
Ratnagiri : "Maharashtra",
Jalna : "Maharashtra",
Nanded : "Maharashtra",
Chandrapur : "Maharashtra",
Parbhani : "Maharashtra",
Sangli : "Maharashtra",
Latur : "Maharashtra",
Bhandara : "Maharashtra",
Beed : "Maharashtra",
Osmanabad : "Maharashtra",
Washim : "Maharashtra",
Sindhudurg : "Maharashtra",
Gandia : "Maharashtra",
Gadchiroli : "Maharashtra",
Wardha : "Maharashtra",
West_Imphal : "Manipur",
Thoubal : "Manipur",
Bishnupur : "Manipur",
Chandel : "Manipur",
Churachandpur : "Manipur",
East_Imphal : "Manipur",
Senapati : "Manipur",
Tamenglong : "Manipur",
Ukhrul : "Manipur",
Kakching : "Manipur",
Kangpokpi : "Manipur",
Jiribam : "Manipur",
Nonev : "Manipur",
Pherzawl : "Manipur",
Tengnoupal : "Manipur",
Kamjong : "Manipur",
East_Khasi_Hills : "Meghalaya",
East_Garo_Hills : "Meghalaya",
West_Jaintia_Hills : "Meghalaya",
Ribhoi : "Meghalaya",
South_Garo_Hills : "Meghalaya",
West_Garo_Hills : "Meghalaya",
West_Khasi_Hills : "Meghalaya",
North_Garo_Hills : "Meghalaya",
East_Jaintia_Hills : "Meghalaya",
South_West_Khasi_Hills : "Meghalaya",
South_West_Garo_Hills : "Meghalaya",
Aizawl : "Mizoram",
Champhai : "Mizoram",
Kolasib : "Mizoram",
Lawngtlai : "Mizoram",
Lunglei : "Mizoram",
Mamit : "Mizoram",
Saiha : "Mizoram",
Serchhip : "Mizoram",
Hnahthial : "Mizoram",
Saitual : "Mizoram",
Khawzawl : "Mizoram",
Dimapur : "Nagaland",
Kohima : "Nagaland",
Mokokchung : "Nagaland",
Mon : "Nagaland",
Phek : "Nagaland",
Tuensang : "Nagaland",
Wokha : "Nagaland",
Zunheboto : "Nagaland",
Peren : "Nagaland",
Kiphire : "Nagaland",
Longleng : "Nagaland",
Jajapur : "Odisha",
Bhadrak : "Odisha",
Baleshwar : "Odisha",
Khordha : "Odisha",
Sundargarh : "Odisha",
Kendrapara : "Odisha",
Koraput : "Odisha",
Dhenkanal : "Odisha",
Kalahandi : "Odisha",
Cuttack : "Odisha",
Puri : "Odisha",
Anugul : "Odisha",
Balangir : "Odisha",
Bargarh : "Odisha",
Boudh : "Odisha",
Deogarh : "Odisha",
Gajapati : "Odisha",
Ganjam : "Odisha",
Jagatsinghapur : "Odisha",
Jharsuguda : "Odisha",
Kandhamal : "Odisha",
Kendujhar : "Odisha",
Malkangiri : "Odisha",
Mayurbhanj : "Odisha",
Nabarangpur : "Odisha",
Nayagarh : "Odisha",
Nuapada : "Odisha",
Rayagada : "Odisha",
Sambalpur : "Odisha",
Sonepur : "Odisha",
Pondicherry : "Puducherry",
Karaikal : "Puducherry",
Mahe : "Puducherry",
Yanam : "Puducherry",
Jalandhar : "Punjab",
Patiala : "Punjab",
Ludhiana : "Punjab",
Sas_Nagar : "Punjab",
Pathankot : "Punjab",
Mansa : "Punjab",
Tarn_Taran : "Punjab",
Amritsar : "Punjab",
Kapurthala : "Punjab",
Hoshiarpur : "Punjab",
Faridkot : "Punjab",
Sangrur : "Punjab",
Shahid_Bhagat_Singh_Nagar : "Punjab",
Firozepur : "Punjab",
Sri_Muktsar_Sahib : "Punjab",
Moga : "Punjab",
Gurdaspur : "Punjab",
Barnala : "Punjab",
Rupnagar : "Punjab",
Fatehgarh_Sahib : "Punjab",
Bathinda : "Punjab",
Fazilka : "Punjab",
Jaipur : "Rajasthan",
Jodhpur : "Rajasthan",
Kota : "Rajasthan",
Ajmer : "Rajasthan",
Bharatpur : "Rajasthan",
Nagaur : "Rajasthan",
Banswara : "Rajasthan",
Jhalawar : "Rajasthan",
Tonk : "Rajasthan",
Jaisalmer : "Rajasthan",
Dausa : "Rajasthan",
Jhunjhunu : "Rajasthan",
Hanumangarh : "Rajasthan",
Bhilwara : "Rajasthan",
Sawai_Madhaopur : "Rajasthan",
Chittorgarh : "Rajasthan",
Dungarpur : "Rajasthan",
Udaipur : "Rajasthan",
Dholpur : "Rajasthan",
Sikar : "Rajasthan",
Alwar : "Rajasthan",
Bikaner : "Rajasthan",
Churu : "Rajasthan",
Pali : "Rajasthan",
Barmer : "Rajasthan",
Karauli : "Rajasthan",
Rajsamand : "Rajasthan",
Baran : "Rajasthan",
Bundi : "Rajasthan",
Ganganagar : "Rajasthan",
Jalore : "Rajasthan",
Sirohi : "Rajasthan",
Pratapgarh : "Rajasthan",
North_District : "Sikkim",
East_District : "Sikkim",
South_District : "Sikkim",
West_District : "Sikkim",
Hyderabad : "Telangana",
Suryapet : "Telangana",
Ranga_Reddy : "Telangana",
Medchalmalkajgiri : "Telangana",
Vikarabad : "Telangana",
Warangal_Urban : "Telangana",
Nizamabad : "Telangana",
Jogulambagadwal : "Telangana",
Nirmal : "Telangana",
Nalgonda : "Telangana",
Adilabad : "Telangana",
Sangareddy : "Telangana",
Kama_Reddy : "Telangana",
Kumurambheemasifabad : "Telangana",
Karimnagar : "Telangana",
Khammam : "Telangana",
Mahabubnagar : "Telangana",
Jagitial : "Telangana",
Rajannasircilla : "Telangana",
Jayashankar_Bhupalapally : "Telangana",
Medak : "Telangana",
Jangoan : "Telangana",
Narayanpet : "Telangana",
Mancherial : "Telangana",
Peddapalli : "Telangana",
Nagarkurnool : "Telangana",
Mulugu : "Telangana",
Bhadradrikothagudem : "Telangana",
Mahabubabad : "Telangana",
Siddipet : "Telangana",
Warangal_Rural : "Telangana",
Wanaparthy : "Telangana",
Yadadribhuvanagiri : "Telangana",
};

/**
 * This is used for any parameter that may be disambiguis , it is complemented by the @location1 entity and helps to detect several
 * locations that might not be detected properly by @sys-location.
 * 
 * If you have any issue regarding the common name of a location and the name that is official , do include that in both
 * @location1 and Disambiguity
 *
 */
const Disambiguity = {
    Bangalore : "Bengaluru Urban",
    Bengaluru : "Bengaluru Urban",
    Bangalore_Urban : "Bengaluru Urban",
    Bangalore_Rural : "Bengaluru Rural",
    Usa :"USA",
    America : "USA",
    Us : "USA",
    Tamilnadu:"Tamil Nadu",
    Kanpur:"Kanpur Nagar",
    Banswara: "Banswara",
    Up:"Uttar Pradesh",
    Mp:"Madhya Pradesh",
    Ap:"Andhra Pradesh",
    Uk:"UK",
    United_Kingdom : "UK",
};

/**
 * This function is used for a location formatting
 * @returns a Camel cased location as our api uses Camel Cased attributes
 *
 */
function capitalize(state){
    statearr = state.split(" ");
    for(i=0;i<statearr.length;i++)
    {
        if(statearr[i]!="and")
        {
            statearr[i] = statearr[i][0].toUpperCase()+statearr[i].slice(1,statearr[i].length).toLowerCase();
        }
    }
    state = statearr.join(" ");
    return state;
}

/**
 * This function Camel case the location as well as remove the space between the location name and replace it with "_"
 */

function formatStates(state) 
{
    statearr = state.split(" ");
    for(i=0;i<statearr.length;i++)
    {
        if(statearr[i]!="and")
        {
            statearr[i] = statearr[i][0].toUpperCase()+statearr[i].slice(1,statearr[i].length).toLowerCase();
        }
    }
  state = statearr.join("_");
  return state;
}


//Main function
async function main(params)
{
    /**
     * This is called by the intent #HowmanyCases
     * 
     * @returns the cases in the corresponding state, district , country or world
     * 
     * here @params can have 3 members 1.type="api" , 2. state(for location) 3.disambiguity 
     */
  if (params.type === "api") 
  { 
      
      /**check here if the entry is a location or not
       * if not then give the world cases result
       */
      if((((typeof params.state)!='undefined')&&(params.state!=null))||(((typeof params.disambiguity)!='undefined')&&(params.disambiguity!=null)))
      { 
        if(((typeof params.disambiguity)!='undefined')&&(params.disambiguity!=null))
         {
             formatted_state = Disambiguity[formatStates(params.disambiguity)];
         }
         else
         {
          formatted_state = capitalize(params.state);
         }
            //console.log(formatted_state);
           k = formatStates(formatted_state);
           //console.log(formatted_state)
      
      try
       { 
           //If iit is in district then show district results
           if ((k) in District) 
           {
          const uri = `https://api.covid19india.org/state_district_wise.json`;

          const data = await request({
            method: "GET",
            uri: uri,
            json: true,
          });
        
           dd=data[District[k]].districtData[formatted_state];
           if((typeof dd)!='undefined'){
          
          return{
            result: `Total Confirmed: ${dd.confirmed}\nTotal Deaths: ${dd.deceased}\nTotal Recovered: ${dd.recovered}\nTotal Active: ${dd.active}\n`,
          };
           }
           }
        
        //If it is in statesi array show the result for state cases
        else if((k) in statesi)
        {   
            
            
           // console.log(formatted_state);
            uri = 'https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise';
            
            const summary = await request({
            method: "GET",
            uri: uri,
            json: true,
            });
            //console.log(summary.data.statewise[0]);
            for (var i = 0; i < summary.data.statewise.length; i++)
            {
                
          if ( summary.data.statewise[i].state === (formatted_state) ) 
          {
             // console.log(formatted_state)
            return {
             result: `Total Confirmed: ${summary.data.statewise[i].confirmed}\nTotal Deaths: ${summary.data.statewise[i].deaths}\nTotal Recovered: ${summary.data.statewise[i].recovered}\nTotal active: ${summary.data.statewise[i].active}\n`,
            };
          }
            
        }
        
        }
        
        //else if it is country show country detail.
       else
       {
           const summary_country = await request({
            method: "GET",
            uri: `https://coronavirus-19-api.herokuapp.com/countries/${formatted_state}`,
            json: true,
          });
          if(
              (typeof summary_country.cases)!='undefined'
              )
          {
             return{
                 result: `Total Cases: ${summary_country.cases}\nTotal Deaths: ${summary_country.deaths}\nTotal Recovered: ${summary_country.recovered}\n Total Active :${summary_country.active}\nToday cases: ${summary_country.todayCases}\nToday deaths: ${summary_country.todayDeaths}\nWe try to achieve accuracy in our data but any mistake is deeply regreted.\n`,
             };
                
              
          }
      
  }
       }
      catch(e){
          return{
              //"Sorry, please check the location";
              result: 'sorry'+e,
          };
      }
      
  
  }
  
  //if any other case is encountered.
                 const summary_country1 = await request({
            method: "GET",
            uri: `https://coronavirus-19-api.herokuapp.com/countries/World`,
            json: true,});
               return{
                   result: `I guess you were looking for Global data\nTotal Cases: ${summary_country1.cases}\nTotal Deaths: ${summary_country1.deaths}\nTotal Recovered: ${summary_country1.recovered}\n Total Active :${summary_country1.active}\nToday cases: ${summary_country1.todayCases}\nToday deaths: ${summary_country1.todayDeaths}\nWe try to achieve accuracy in our data but any mistake is deeply regreted\n.If you have not got the desired result make sure you have used correct spelling or else report this problem at the contact us.\n`,
               };
                
  
 
  }
  
  /**
   * 
   * This will provide you with 4 details-
   * 1. Highest cases in state (for india)
   * 2. Highest cases in country 
   * 3. Top "N" effected countries in the world
   * 4. Top "N" effected states or UT's in India.
   * 
   * @params can have 3 members - 1. type = "stats" 2.location1(representing India) 3.number(N)
   * 
   */
else if(params.type =="stats")
 {
     //Check if params.location1 , i,e the person is asking for India states.
     if(((typeof params.location1)!='undefined')&&(params.location1!=null))
     {
         
         const summary_data = await request({
            method: "GET",
            uri: 'https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise',
            json: true,
          });
          j = "";
          
          //If "N" is provided
        if(((typeof params.number)!='undefined')&&(params.number!=null))
        {
            //only range [1-25] is allowed for "N"
            if(params.number>0&&params.number<=25){
            for(i=0;i<params.number;i++)
          {
              j += "State : "+summary_data.data.statewise[i].state+"\t Total cases : "+summary_data.data.statewise[i].confirmed+"\tTotal deaths : "+summary_data.data.statewise[i].deaths+"\tTotal Recovered : "+summary_data.data.statewise[i].state.recovered+"\n----------------\n";
          }
            }
            
            else
            {
                return{
                    result:'If you want details for n most affected countries {ask any number in [1-50] }Top effected countries\nIf you want details of n most effected states in india {ask any number in [1-25] }Top effected states in india',
        };
                }
            }
        //else show the highest effected state
        else
        {
            j+= "The highest number of cases as of today is in : \n"
            j+="State : "+summary_data.data.statewise[0].state+"\t Total cases : "+summary_data.data.statewise[0].confirmed+"\tTotal deaths : "+summary_data.data.statewise[0].deaths+"\tTotal Recovered : "+summary_data.data.statewise[0].state.recovered+"\n";
            j+="If you want details for n most affected countries {ask any number in [1-50] }Top effected countries\nIf you want details of n most effected states in india {ask any number in [1-25] }Top effected states in india\n";
        }
        console.log(j);
        return{
          result : `${j}`,
        };
     }
     //if location1 is not present show the same type of results for a country
     else{
        const summary_data = await request({
            method: "GET",
            uri: `https://coronavirus-19-api.herokuapp.com/countries`,
            json: true,
          });
          j = "";
          
          //If number is present between [1-50]
        if(((typeof params.number)!='undefined')&&(params.number!=null))
        {
            if(params.number>0&&params.number<=50){
            for(i=1;i<=params.number;i++)
          {
              j += "Country : "+summary_data[i].country+"\t Total cases : "+summary_data[i].cases+"\tTotal deaths : "+summary_data[i].deaths+"\tTotal Recovered : "+summary_data[i].recovered+"\n----------------\n";
          }
            }
            else
            {
                return{
                    result:'If you want details for n most affected countries {ask any number in [1-50] }Top effected countries\nIf you want details of n most effected states in india {ask any number in [1-25] }Top effected states in india',
        };
                }
            }
        //else show the highest cases tally for world
        else
        {
            j+= "The highest number of cases as of today is: \n"
            j+="Country : "+summary_data[1].country+"\t Total cases : "+summary_data[1].cases+"\tTotal deaths : "+summary_data[1].deaths+"\tTotal Recovered : "+summary_data[1].recovered+"\n";
            j+="If you want details for n most affected countries {ask any number in [1-50] }Top effected countries\nIf you want details of n most effected states in india {ask any number in [1-25] }Top effected states in india\n";
        }
        console.log(j);
        return{
          result : `${j}`,
        };
        
     }
 }
 
 /**
  * This provide the user with the number of test happend until now in the world
  * 
  * @params include two members - 1.type = "test" 2. location 
  * 
  */
 else if(params.type=="test")
  {
       if((((typeof params.state)!='undefined')&&(params.state!=null))||(((typeof params.disambiguity)!='undefined')&&(params.disambiguity!=null)))
      { 
          //if the location is in diambiguity
        if(((typeof params.disambiguity)!='undefined')&&(params.disambiguity!=null))
         {
             countary = Disambiguity[formatStates(params.disambiguity)];
         }
         //if it is not a district and not a state (because if it is a state or district of india no data is present)
        else if(!((params.state) in District)&&(!((params.state ) in statesi)))
         {
          countary = capitalize(params.state);
         }
        else
        {
            return{
                 result : 'We provide the testing details only countrywise. Sorry! ask How many cases in (Country name)',
             };
         }
       try{ 
          const uri = `https://coronavirus-19-api.herokuapp.com/countries/${countary}`;

          const data = await request({
            method: "GET",
            uri: uri,
            json: true,
          });
            if(
              (typeof data.cases)!='undefined'
              ){
            return {
              result: `country: ${data.country}\nTotal Tests: ${data.totalTests}\nTests Per Million: ${data.testsPerOneMillion}\nToday Cases: ${data.todayCases}\nActive: ${data.active}`,
            };
              }
            else
              {
                  return{
                      result : `Sorry, We provide testing details only country wise. Try- How many cases in (Country name)`,
                  };
              }
      }
         catch(e){
          return{
              //"Sorry, please check the location";
              result: 'sorry'+e,
          };
      }
  }
  
  else
  {
      return{
                result : `Sorry, We provide testing details only country wise. Try- How many cases in (Country name)`,
            };
  }
  }
 /**
  * 
  * This provide with deatails of useful resources that may be needed.
  * 
  * @params include 4 members - 1.type = "resource" 2. state (for location) 3. resource
  * 
  * 
  */ 
else if(params.type =="resources")
 {
    
       const resource_detail = await request({
            method: "GET",
            uri: `https://api.covid19india.org/resources/resources.json`,
            json: true,
        });
     results = "";
     dist = "a";
     states = "a";
     if(((typeof params.state)!='undefined')&&(params.state!=null))
     { 
        if(((typeof params.state)!='undefined')&&(params.state!=null))
        {
            if(formatStates(params.state) in District)
            {
                dist = capitalize(params.state);

            }
            else if(formatStates(params.state) in statesi)
            {
                states = capitalize(params.state);
            }
            else
            {
                dist = capitalize(params.state);
            }
        }
        if(((typeof params.resource)!='undefined')&&(params.resource!=null))
        {
            if(params.resource == "Hospitals")
            {
                if(states=="a")
                {
                    for(i=0;i<resource_detail.resources.length;i++)
                    {
                       if((resource_detail.resources[i].city==dist)&&(resource_detail.resources[i].category=="Hospitals and Centers"))
                        {
                            results+="Service description : "+resource_detail.resources[i].descriptionandorserviceprovided+"\nOrganisation name : "+resource_detail.resources[i].nameoftheorganisation+"\nContact : "+resource_detail.resources[i].phonenumber+"\n--------------------\n";
                        }
                    }
                }
                else{
                    //console.log(states);
                    for(i=0;i<resource_detail.resources.length;i++)
                    {
                       if((resource_detail.resources[i].state==states)&&(resource_detail.resources[i].category=="Hospitals and Centers"))
                        {
                            results+="Service description : "+resource_detail.resources[i].descriptionandorserviceprovided+"\nCity: "+resource_detail.resources[i].city+"\nOrganisation name : "+resource_detail.resources[i].nameoftheorganisation+"\nContact : "+resource_detail.resources[i].phonenumber+"\n--------------------\n";
                        }
                    }
                }
                
            }
            
            else if(params.resource == "Police")
            {
                if(states=="a")
                {
                    for(i=0;i<resource_detail.resources.length;i++)
                    {
                       if((resource_detail.resources[i].city==dist)&&(resource_detail.resources[i].category=="Police"))
                        {
                            results+="Service description : "+resource_detail.resources[i].descriptionandorserviceprovided+"\nOrganisation name : "+resource_detail.resources[i].nameoftheorganisation+"\nContact : "+resource_detail.resources[i].phonenumber+"\n--------------------\n";
                        }
                    }
                }
                else{
                    
                    for(i=0;i<resource_detail.resources.length;i++)
                    {
                       if((resource_detail.resources[i].state==states)&&(resource_detail.resources[i].category=="Police"))
                        {
                           results+="Service description : "+resource_detail.resources[i].descriptionandorserviceprovided+"\nCity: "+resource_detail.resources[i].city+"\nOrganisation name : "+resource_detail.resources[i].nameoftheorganisation+"\nContact : "+resource_detail.resources[i].phonenumber+"\n--------------------\n";
                        }
                    }
                }
                
            }
            
            
            else if(params.resource == "Testing Lab")
            {
                if(states=="a")
                {
                    for(i=0;i<resource_detail.resources.length;i++)
                    {
                       if((resource_detail.resources[i].city==dist)&&(resource_detail.resources[i].category=="CoVID-19 Testing Lab"))
                        {
                            results+="Service description : "+resource_detail.resources[i].descriptionandorserviceprovided+"\nOrganisation name : "+resource_detail.resources[i].nameoftheorganisation+"\nContact : "+resource_detail.resources[i].phonenumber+"\n--------------------\n";
                        }
                    }
                }
                else{
                    
                    for(i=0;i<resource_detail.resources.length;i++)
                    {
                       if((resource_detail.resources[i].state==states)&&(resource_detail.resources[i].category=="CoVID-19 Testing Lab"))
                        {
                            results+="Service description : "+resource_detail.resources[i].descriptionandorserviceprovided+"\nCity: "+resource_detail.resources[i].city+"\nOrganisation name : "+resource_detail.resources[i].nameoftheorganisation+"\nContact : "+resource_detail.resources[i].phonenumber+"\n--------------------\n";
                        }
                    }
                }
                
            }

            else if(params.resource == "Food")
            {
                if(states=="a")
                {
                    for(i=0;i<resource_detail.resources.length;i++)
                    {
                       if((resource_detail.resources[i].city==dist)&&((resource_detail.resources[i].category=="Free Food")||(resource_detail.resources[i].category=="Community Kitchen")))
                        {
                            results+="Service description : "+resource_detail.resources[i].descriptionandorserviceprovided+"\nOrganisation name : "+resource_detail.resources[i].nameoftheorganisation+"\nContact : "+resource_detail.resources[i].phonenumber+"\n--------------------\n";
                        }
                    }
                }
                else{
                    
                    for(i=0;i<resource_detail.resources.length;i++)
                    {
                       if((resource_detail.resources[i].state==states)&&((resource_detail.resources[i].category=="Free Food")||(resource_detail.resources[i].category=="Community Kitchen")))
                        {
                            results+="Service description : "+resource_detail.resources[i].descriptionandorserviceprovided+"\nCity: "+resource_detail.resources[i].city+"\nOrganisation name : "+resource_detail.resources[i].nameoftheorganisation+"\nContact : "+resource_detail.resources[i].phonenumber+"\n--------------------\n";
                        }
                    }
                }
                
            }
            
            
            else if(params.resource == "Delivery Service")
            {
                if(states=="a")
                {
                    for(i=0;i<resource_detail.resources.length;i++)
                    {
                       if((resource_detail.resources[i].city==dist)&&(resource_detail.resources[i].category=="Delivery [Vegetables, Fruits, Groceries, Medicines, etc.]"))
                        {
                           results+="Service description : "+resource_detail.resources[i].descriptionandorserviceprovided+"\nOrganisation name : "+resource_detail.resources[i].nameoftheorganisation+"\nContact : "+resource_detail.resources[i].phonenumber+"\n--------------------\n";
                        }
                    }
                }
                else{
                    
                    for(i=0;i<resource_detail.resources.length;i++)
                    {
                       if((resource_detail.resources[i].state==states)&&(resource_detail.resources[i].category=="Delivery [Vegetables, Fruits, Groceries, Medicines, etc.]"))
                        {
                            results+="Service description : "+resource_detail.resources[i].descriptionandorserviceprovided+"\nCity: "+resource_detail.resources[i].city+"\nOrganisation name : "+resource_detail.resources[i].nameoftheorganisation+"\nContact : "+resource_detail.resources[i].phonenumber+"\n--------------------\n";
                        }
                    }
                }
                
            }
    

          else if(params.resource == "Government Helpline")
            {
                if(states=="a")
                {
                    for(i=0;i<resource_detail.resources.length;i++)
                    {
                       if((resource_detail.resources[i].city==dist)&&(resource_detail.resources[i].category=="Government Helpline"))
                        {
                            results+="Service description : "+resource_detail.resources[i].descriptionandorserviceprovided+"\nOrganisation name : "+resource_detail.resources[i].nameoftheorganisation+"\nContact : "+resource_detail.resources[i].phonenumber+"\n--------------------\n";
                        }
                    }
                }
                else{
                    
                    for(i=0;i<resource_detail.resources.length;i++)
                    {
                       if((resource_detail.resources[i].state==states)&&(resource_detail.resources[i].category=="Government Helpline"))
                        {
                            results+="Service description : "+resource_detail.resources[i].descriptionandorserviceprovided+"\nCity: "+resource_detail.resources[i].city+"\nOrganisation name : "+resource_detail.resources[i].nameoftheorganisation+"\nContact : "+resource_detail.resources[i].phonenumber+"\n--------------------\n";
                        }
                    }
                }
                
            }
            else if(params.resource == "NGO")
            {
               if(states=="a")
                {
                    for(i=0;i<resource_detail.resources.length;i++)
                    {
                       if((resource_detail.resources[i].city==dist)&&((resource_detail.resources[i].category=="Fundraisers")||(resource_detail.resources[i].category=="Accomodation")||(resource_detail.resources[i].category=="Others")))
                        {
                            results+="Service description : "+resource_detail.resources[i].descriptionandorserviceprovided+"\nOrganisation name : "+resource_detail.resources[i].nameoftheorganisation+"\nContact : "+resource_detail.resources[i].phonenumber+"\n--------------------\n";
                        }
                    }
                }
                else{
                
                    for(i=0;i<resource_detail.resources.length;i++)
                    {
                       if((resource_detail.resources[i].state==states)&&((resource_detail.resources[i].category=="Fundraisers")||(resource_detail.resources[i].category=="Accomodation")||(resource_detail.resources[i].category=="Others")))
                        {
                            results+="Service description : "+resource_detail.resources[i].descriptionandorserviceprovided+"\nCity: "+resource_detail.resources[i].city+"\nOrganisation name : "+resource_detail.resources[i].nameoftheorganisation+"\nContact : "+resource_detail.resources[i].phonenumber+"\n--------------------\n";
                        }
                    }
                }
                
            }
        }
        else
        {
                      return{
            result: `Sorry please ask for a specific resource. Ask {Resource-name} in {city-name or state-name}\nResources include these-\n1. Police \t2. Testing Lab \n3. Hospitals \t4. Accomodation \n5.NGO \t6.Food \n7.Community Kitchen \t8.Government Helpline. `,
        
                      };
        }
        if(results!=""){
        return{
            result : `${results}`,
        };
        }
        else
        {
           return{
            result: `Sorry we dont have the information at the moment. Ask {Resource-name} in {city-name or state-name}\nResources include these-\n1. Police \t2. Testing Lab \n3. Hospitals \t4. Accomodation \n5.NGO \t6.Food \n7.Community Kitchen \t8.Government Helpline. `,
        }; 
        }
     }
    else{
        return{
            result: `Sorry we dont have the information at the moment. Ask {Resource-name} in {city-name or state-name}\n`,
        };
    }


 }
 
 /**
  * 
  * if any latest news is asked or any answer is not in chatbot it search on discovery news and return the data.
  *
  */
  else {
    const discovery = new DiscoveryV1({
      version: "2019-03-25",
      iam_apikey: params.api_key,
      url: params.url,
    });

    const offset = getRandomInt(50);

    const queryParams = {
      environment_id: params.env_id,
      collection_id: params.collection_id,
      natural_language_query:
        "corona virus " + params.input || "corona virus news",
      count: 2,
      offset: offset,
    };
    try {
      data = await discovery.query(queryParams);
      let response = data.results.map((v, i) => {
        return `${v.title}
                 ${v.text}
                 ${v.url}`;
      });
      return {
        result:
          "Here are some news articles we found related to your search. We can’t verify the accuracy of all of these sources.\n\n" +
          response.join("\n\n"),
      };
    } catch (err) {
      return { error: "it failed : " + err };
    }
  }
  
}





