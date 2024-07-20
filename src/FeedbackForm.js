import React, { useState, useEffect } from 'react';
import { firestore, storage } from './firebase'; // Ensure the path is correct
import { useDropzone } from 'react-dropzone';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import './FeedbackForm.css'; // Ensure your CSS file is named correctly and in the right directory

const states = {
  "Andhra Pradesh": [
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati", "Kadapa", "Rajahmundry", 
    "Kakinada", "Anantapur", "Eluru", "Ongole", "Chittoor", "Machilipatnam", "Adoni", "Tenali", "Hindupur", 
    "Proddatur", "Nandyal", "Bhimavaram", "Madanapalle", "Guntakal", "Srikakulam", "Dharmavaram", "Gudivada", 
    "Narasaraopet", "Tadipatri", "Tadepalligudem", "Chilakaluripet", "Yemmiganur", "Kadiri", "Tuni", "Markapur", 
    "Nagari", "Kavali", "Vinukonda", "Palakollu", "Rayachoti", "Bapatla", "Srikalahasti", "Sattenapalle", "Ponnur", 
    "Puttur", "Venkatagiri", "Narasapur", "Macherla", "Nidadavole", "Tanuku", "Peddapuram", "Samalkota", "Jaggayyapeta", 
    "Mylavaram", "Kanigiri", "Amaravati", "Nuzvid", "Mandapeta", "Gudur", "Bobbili", "Salur", "Parvathipuram", "Tekkali", 
    "Palasa", "Atmakur", "Nandigama", "Narasannapeta", "Pithapuram", "Chemmumiahpet", "Kandukur", "Rajampet", "Manubolu", 
    "Pedana", "Pamarru", "Punganur", "Pithapuram", "Gooty", "Anakapalle", "Sarubujjili", "Kovvuru", "Mummidivaram", 
    "Narsipatnam", "Amalapuram", "Peddapuram", "Yeleswaram", "Ramachandrapuram", "Nagari", "Gajuwaka"
  ],
  "Arunachal Pradesh": [
    "Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Aalo", "Tezu", "Bomdila", "Roing", 
    "Khonsa", "Changlang", "Namsai", "Daporijo", "Seppa", "Yingkiong", "Anini", "Along", "Basar", 
    "Ruksin", "Pangin", "Koloriang", "Hawai", "Menchuka", "Hayuliang", "Pangin", "Jairampur", 
    "Dirang", "Sagalee", "Sangram", "Likabali", "Longding"
  ],
  "Assam": [
    "Guwahati", "Dispur", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", 
    "Bongaigaon", "Karimganj", "Lakhimpur", "Sivasagar", "Dhubri", "Goalpara", "Barpeta", 
    "Dhekiajuli", "Diphu", "Golaghat", "Hailakandi", "Mangaldoi", "Marigaon", "Nalbari", 
    "North Lakhimpur", "Rangia", "Sibsagar", "Silapathar", "Tamulpur", "Titabor", "Udalguri", 
    "Hojai", "Biswanath Chariali", "Majuli", "Kokrajhar"
  ],
  "Bihar": [
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", 
    "Begusarai", "Katihar", "Munger", "Chhapra", "Hajipur", "Siwan", "Bettiah", "Saharsa", 
    "Dehri", "Buxar", "Jehanabad", "Aurangabad", "Lakhisarai", "Nawada", "Samastipur", 
    "Motihari", "Supaul", "Sasaram", "Jamalpur", "Sitamarhi", "Saurikh", "Bagaha", 
    "Kishanganj", "Sugauli", "Rajgir", "Sheohar", "Madhubani", "Bihpur", "Dumraon", 
    "Sasaram", "Araria", "Jamui", "Barauni", "Khagaria", "Lakhisarai", "Mokama", 
    "Phulwari", "Raxaul", "Rosera", "Sheikhpura", "Sheohar", "Warisaliganj", "Amarpur", 
    "Sonepur", "Koilwar", "Barauni IOC Township", "Gogri Jamalpur", "Marhaura"
  ],
  "Chhattisgarh": [
    "Raipur", "Bilaspur", "Durg", "Korba", "Jagdalpur", "Raigarh", "Ambikapur", "Kawardha", 
    "Dhamtari", "Bemetara", "Janjgiri-Champa", "Mungeli", "Rajnandgaon", "Balod", "Kanker", 
    "Bijapur", "Sukma", "Janjgir", "Kondagaon", "Narayanpur", "Patan", "Dabhra", "Gariaband", 
    "Dongargarh", "Takhatpur", "Pali", "Kawardha", "Raman", "Bacheli", "Bhilai", "Sarangarh", 
    "Durgapur", "Raigarh", "Bilaspur", "Rajim", "Sarangarh", "Bhilai", "Fatehgarh", "Khairagarh", 
    "Pathalgaon", "Naya Raipur", "Pithora", "Bemetara", "Aarang", "Mahasamund", "Sihora"
  ],
  "Goa": [
    "Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Cortalim", "Calangute", "Arambol", 
    "Bicholim", "Quepem", "Sanguem", "Canacona", "Dabolim", "Salcete", "Taleigao", "Arossim", 
    "Navelim", "Seraulim", "Majorda", "Colva", "Benaulim", "Betalbatim", "Loutolim", "Cortalim", 
    "Velsao", "Varca", "Raia", "Chicalim", "Santa Cruz", "Mormugao", "Verna", "Sancoale", 
    "Pale", "Aldona", "Anjuna", "Assagao", "Baga", "Candolim", "Dona Paula", "Goltim", 
    "Nerul", "Panjim", "Sangolda", "Mapusa", "Colva", "Saligao", "Guirim", "Mogim"
  ],
  "Gujarat": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", 
    "Anand", "Nadiad", "Patan", "Mehsana", "Navsari", "Valsad", "Bharuch", "Kutch", "Porbandar", 
    "Morbi", "Palanpur", "Godhra", "Dahod", "Vapi", "Ankleshwar", "Upleta", "Borsad", "Himatnagar", 
    "Vijapur", "Chhota Udaipur", "Dangs", "Dhrangadhra", "Limbdi", "Modasa", "Sabarkantha", 
    "Surendranagar", "Valsad", "Patan", "Gandhinagar", "Gondal", "Kheda", "Bharuch", "Narmada", 
    "Upleta", "Patan", "Jamnagar", "Himmatnagar", "Palanpur", "Vapi", "Rajkot", "Bharuch", 
    "Anand", "Patan", "Nadiad", "Kutch", "Borsad", "Chhota Udaipur"
  ],
  "Haryana": [
    "Chandigarh", "Gurugram", "Faridabad", "Karnal", "Panipat", "Ambala", "Hisar", "Rohtak", 
    "Sirsa", "Yamunanagar", "Jind", "Sonipat", "Kurukshetra", "Fatehabad", "Bhiwani", "Panchkula", 
    "Mahendragarh", "Palwal", "Rewari", "Jhajjar", "Kaithal", "Gohana", "Narnaul", "Hansi", 
    "Charkhi Dadri", "Tosham", "Barwala", "Pinjore", "Pinjore", "Bhiwani", "Assandh", 
    "Hodal", "Karnal", "Pehowa", "Kalka", "Mewat", "Ratia", "Jind", "Kaithal", "Fatehabad"
  ],
  "Himachal Pradesh": [
    "Shimla", "Manali", "Dharamshala", "Mandi", "Kullu", "Solan", "Kangra", "Hamirpur", 
    "Bilaspur", "Una", "Chamba", "Palampur", "Nahan", "Jawalaji", "Rohru", "Sundernagar", 
    "Arki", "Jubbal", "Ponta Sahib", "Baddi", "Nalagarh", "Rajgarh", "Mandi", "Kangra", 
    "Ghumarwin", "Jwalamukhi", "Shoghi", "Karsog", "Chandigarh", "Kalpa", "Sarahan", 
    "Rohru", "Dharampur", "Rohru", "Mandi", "Hamirpur", "Tattapani", "Gaggal", "Rohru", 
    "Pangna", "Rampur", "Gohar", "Tirthan", "Kinnaur"
  ],
  "Jharkhand":[
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Hazaribagh", "Giridih", "Chaibasa", 
    "Deoghar", "Dumka", "Koderma", "Ramgarh", "Jamtara", "Palamu", "Simdega", "Lohardaga", 
    "Seraikela", "Madhupur", "Gumla", "Pakur", "Godda", "Sahebganj", "Khunti", "Siliguri", 
    "Hazaribagh", "Daltonganj", "Chandil", "Bermo", "Bokaro", "Ramsay", "Kolkata", "Raghunathganj", 
    "Nawadih", "Bundi", "Manoharpur", "Silli", "Barhi", "Jugsalai", "Kumarhat"
  ],
  "Karnataka": [
    "Bangalore", "Mysore", "Hubli", "Dharwad", "Belgaum", "Mangalore", "Shimoga", "Tumkur", 
    "Udupi", "Kolar", "Bidar", "Chikkamagalur", "Raichur", "Bagalkot", "Gulbarga", "Hospet", 
    "Davangere", "Chitradurga", "Karwar", "Mandya", "Haveri", "Sirsi", "Sagara", "Yadgir", 
    "Vijayapura", "Koppal", "Hassan", "Channarayapatna", "Siddapur", "Shivamogga", "Bagalkote", 
    "Chikballapur", "Karkala", "Puttur", "Kumta", "Kodagu", "Haveri", "Kolar", "Tumkur", 
    "Raichur", "Chikodi", "Gadag", "Nanjangud", "Puttur", "Kadur", "Malur", "Sandur", 
    "Belur", "Devadurga", "Hunsur", "Koppal", "Honnali", "Kolar", "Ramanagara", "Bellary", 
    "Lakshmeshwar", "Bagalkot", "Hubli", "Savanur", "Bangalore"
  ],
  "Kerala": [
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Alappuzha", "Thrissur", "Kannur", 
    "Malappuram", "Palakkad", "Kottayam", "Pathanamthitta", "Wayanad", "Idukki", "Ponnani", 
    "Vatakara", "Changanassery", "Muvattupuzha", "Ottappalam", "Perinthalmanna", "Kasaragod", 
    "Payyannur", "Kalpetta", "Nilambur", "Mannarkkad", "Paravur", "Sreekrishnapuram", "Cherthala", 
    "Adoor", "Nedumangad", "Punnamada", "Kaduthuruthy", "Ernakulam", "Nelliyampathy", "Palai", 
    "Sultan Bathery", "Varkala", "Kattappana", "Pallikkathode", "Mankada", "Nedumangadu", 
    "Kozhikode", "Kochi", "Ayyanthole", "Kallettumkara", "Mazhavil", "Kallekkad", "Meenangadi"
  ],
  "Madhya Pradesh": [
    "Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Satna", "Rewa", "Khandwa", 
    "Katni", "Shivpuri", "Dewas", "Chhindwara", "Ratlam", "Burhanpur", "Mandsaur", "Sehore", 
    "Neemuch", "Balaghat", "Tikamgarh", "Damoh", "Hoshangabad", "Narsinghpur", "Rajgarh", 
    "Panna", "Shahdol", "Guna", "Vidisha", "Raisen", "Agar Malwa", "Datia", "Singrauli", 
    "Sarni", "Khurai", "Biora", "Maihar", "Sihora", "Jhabua", "Mandideep", "Siddhi", 
    "Burhanpur", "Mhow", "Dabra", "Niwari", "Rahatgarh", "Seoni", "Shivpuri", "Chachoda"
  ],
  "Maharashtra": [
    "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Kolhapur", "Solapur", 
    "Jalgaon", "Amravati", "Latur", "Ahmednagar", "Satara", "Ichalkaranji", "Kalyan", 
    "Dombivli", "Nanded", "Sangli", "Chandrapur", "Parbhani", "Bhusawal", "Wardha", 
    "Yavatmal", "Ratnagiri", "Palghar", "Dhule", "Shirdi", "Karad", "Akola", 
    "Malegaon", "Jalna", "Osmanabad", "Bhiwandi", "Nagpur", "Matheran", "Vasai", 
    "Bhandara", "Chakan", "Khopoli", "Murbad", "Nashik", "Raigad", "Kalyan-Dombivli", 
    "Gadchiroli", "Buldhana", "Washim", "Ambejogai", "Nanded", "Agar", "Pimpri-Chinchwad", 
    "Vita", "Sangrampur", "Raver", "Mahad", "Wani", "Baramati", "Sinner"
  ],
  "Manipur": [
    "Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Senapati", "Tamenglong", "Ukhrul", 
    "Jiribam", "Kakching", "Kangpokpi", "Yairipok", "Lamlai", "Tengnoupal", "Moreh", 
    "Moirang", "Noney", "Pallel", "Wangjing", "Kakching", "Saitu", "Singshikhong", 
    "Jiribam", "Lambui", "Nambol", "Tengnoupal", "Kakching", "Sapermeina", "Nungba", 
    "Nungshang", "Khumji", "Wangoi", "Khangabok", "Singjamei", "Moirang", "Lambui"
  ],
  "Meghalaya": [
    "Shillong", "Tura", "Nongstoin", "Jowai", "Williamnagar", "Borama", "Mairang", "Khliehriat",
    "Resubelpara", "Baghmara", "Rongjeng", "Nongpoh", "Nongkrem", "Pynursla", "Smit", 
    "Mawlai", "Mawphlang", "Mawkyrwat", "Mawsynram", "Rangthong", "Jowai", "Mairang",
    "Sohra", "Sohiong", "Mawkyrwat", "Laitkroh", "Shillong", "Nongkrem", "Nongstoin", 
    "Pynursla", "Rongjeng", "Williamnagar", "Tura", "Boram", "Mawphlang", "Rongjeng",
    "Nongpoh", "Jowai", "Laitumkhrah"
  ],
  "Mizoram": [
    "Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Mamit", "Serchhip", "Hnahthial",
    "Lawngtlai", "Khawzawl", "Hlimen", "Kolasib", "Saitual", "Lunglei", "Mamit", 
    "Champhai", "Serchhip", "Saiha", "Aizawl", "Thenzawl", "Khawzawl", "Siaha", 
    "Hnahthial", "Mamit", "Lunglei", "Kolasib", "Saiha", "Serchhip", "Champhai",
    "Khawzawl", "Aizawl", "Saitual", "Lunglei", "Mamit", "Saiha", "Hnahthial"
  ],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Wokha", "Tuensang", "Zunheboto", "Phek", 
  "Mon", "Kiphire", "Longleng", "Kohima", "Dimapur", "Mokokchung", "Wokha", 
  "Tuensang", "Zunheboto", "Phek", "Mon", "Kiphire", "Longleng", "Kohima", 
  "Dimapur", "Mokokchung", "Wokha", "Tuensang", "Zunheboto", "Phek", "Mon", 
  "Kiphire", "Longleng", "Kohima", "Dimapur", "Mokokchung", "Wokha"
],
  "Odisha": [
    "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Balasore", 
    "Baripada", "Jharsuguda", "Koraput", "Puri", "Bargarh", "Jeypore", "Angul", 
    "Kendrapara", "Kalahandi", "Nabarangpur", "Boudh", "Sonepur", "Ganjam", 
    "Dhenkanal", "Gajapati", "Khurda", "Kandhamal", "Malkangiri", "Jajpur", 
    "Cuttack", "Bhubaneswar", "Rourkela", "Berhampur", "Sambalpur", "Balasore", 
    "Baripada", "Jharsuguda", "Koraput", "Puri", "Bargarh", "Jeypore", "Angul", 
    "Kendrapara", "Kalahandi", "Nabarangpur", "Boudh", "Sonepur", "Ganjam", 
    "Dhenkanal", "Gajapati", "Khurda", "Kandhamal", "Malkangiri", "Jajpur"
  ],
  "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali", "Barnala", 
  "Fatehgarh Sahib", "Moga", "Kapurthala", "Rupnagar", "Sangrur", "Gurdaspur", 
  "Hoshiarpur", "Faridkot", "Ferozepur", "Mansa", "Pathankot", "Sri Muktsar Sahib", 
  "Jagraon", "Phagwara", "Samrala", "Khamano", "Zirakpur", "Raja Sansi", 
  "Dera Bassi", "Jaitu", "Malout", "Jandiala Guru", "Sultanpur Lodhi", "Banga", 
  "Makhu", "Khanna", "Hoshiarpur", "Moga", "Fatehgarh Sahib", "Mansa", "Pathankot"],

  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Alwar", "Sikar", 
  "Bhilwara", "Pali", "Ratlami", "Jaisalmer", "Chittorgarh", "Barmer", "Nagaur", 
  "Hanumangarh", "Dausa", "Jhunjhunu", "Sri Ganganagar", "Bundi", "Tonk", "Sirohi", 
  "Rajsamand", "Karauli", "Jhalawar", "Dholpur", "Dungarpur", "Banswara", "Jalore", 
  "Baran", "Rajgarh", "Pratapgarh", "Jaisalmer", "Kota", "Udaipur", "Churu", 
  "Sawai Madhopur", "Rishabhdeo", "Kishangarh", "Ratangarh", "Phalodi"],
  
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Rangbang", "Singtam",
  "Jorethang", "Yuksom", "Khamdong", "Martam", "Pemayangtse", "Pelling",
  "Chungthang", "Khedum", "Kabi", "Lachung", "Lachen", "Melli", "Chopta", 
  "Chungthang", "Dikchu", "Khamdong", "Martam", "Rangpo", "Rangbang", 
  "Tumin", "Tarsung", "Sang", "Pakyong", "Lingzey", "Singtam"],

  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Tirunelveli", "Salem", "Tiruppur", 
  "Vellore", "Erode", "Ramanathapuram", "Thanjavur", "Kanchipuram", "Cuddalore", 
  "Dharmapuri", "Nagercoil", "Nagapattinam", "Karaikudi", "Sivakasi", "Tiruchengode", 
  "Ariyalur", "Palani", "Pudukkottai", "Dindigul", "Kumbakonam", "Sriperumbudur", 
  "Ambur", "Vaniyambadi", "Bodinayakanur", "Kovilpatti", "Sankagiri", "Nallur", 
  "Sivaganga", "Mettur", "Bhavani", "Arakkonam", "Gingee", "Natham", "Paramakudi", 
  "Rajapalayam", "Tiruvannamalai", "Vellore", "Nanjil Nadu", "Tenkasi", "Udumalpet"],

  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Mahbubnagar", 
  "Adilabad", "Nalgonda", "Medak", "Rangareddy", "Jagtial", "Jagitial", "Kothagudem",
  "Kamareddy", "Peddapalli", "Sangareddy", "Mancherial", "Nirmal", "Jangaon",
  "Nagarkurnool", "Vikarabad", "Mahabubabad", "Yadadri", "Wanaparthy", "Jogulamba",
  "Nizamabad", "Medchal", "Malkajgiri", "Kothagudem", "Khammam", "Siddipet", 
  "Kothagudem", "Warangal", "Hyderabad", "Kakinada", "Ramagundam", "Sircilla",
  "Tirumalagiri", "Suryapet", "Narayanpet", "Vemulawada", "Shadnagar", "Peddapalli"],

  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia", "Amarpur", 
  "Khowai", "Teliamura", "Kumarghat", "Rupahali", "Chandrapur", "Jirania", 
  "Bagbasa", "Gakulnagar", "Mohanpur", "Pratapgarh", "Sabroom", "Mandakini", 
  "Kamalpur", "Dhanpur", "Radhanagar", "Rajnagar", "Sidhai", "Rangamati", 
  "Bishalgarh", "Sonamura", "Jatrapur", "Hapania", "Suryamaninagar", "Narsingarh"
],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Allahabad", "Ghaziabad", "Noida", 
  "Meerut", "Aligarh", "Moradabad", "Bareilly", "Mathura", "Fatehpur", 
  "Gorakhpur", "Jhansi", "Saharanpur", "Rampur", "Muzaffarnagar", "Budaun", 
  "Shahjahanpur", "Raebareli", "Etawah", "Amroha", "Sitapur", "Bijnor", 
  "Pratapgarh", "Hapur", "Sambhal", "Kannauj", "Kasganj", "Deoria", "Jalaun", 
  "Bulandshahr", "Unnao", "Kushinagar", "Mau", "Sonbhadra", "Jhangirabad", 
  "Sultanpur", "Chandausi", "Nagar", "Pilibhit", "Farrukhabad", "Basti", 
  "Gonda", "Kheri", "Azamgarh", "Moradabad", "Hathras", "Lalitpur", 
  "Faizabad", "Shikohabad", "Aligarh", "Mau", "Rae Bareli", "Jalaun"],

  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Nainital", "Rishikesh", "Haldwani", 
  "Uttarkashi", "Almora", "Pithoragarh", "Kashipur", "Karanprayag", "Bageshwar",
  "Mussoorie", "Ramnagar", "Rudrapur", "Jaspur", "Champawat", "Lalkuan", 
  "Haridwar", "Nainital", "Roorkee", "Rishikesh", "Haldwani", "Pauri", 
  "Doiwala", "Bhagwanpur", "Rudraprayag", "Bariyakot", "Khatima", 
  "Kausani", "Jwalapur", "Badrinath", "Gopeshwar", "Kankhal", "Kirtinagar", 
  "Pithoragarh", "Dwarahat", "Dunagiri", "Sitarganj", "Srinagar"],

  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol", "Bardhaman", 
  "Jalpaiguri", "Medinipur", "Kharagpur", "Bongaon", "Raniganj", "Haldia", 
  "Alambazar", "North Dumdum", "South Dumdum", "Baranagar", "Bhatpara", 
  "Behala", "Durgapur", "Bankura", "Purulia", "Kulti", "Chandernagore", 
  "Kolkata", "Cooch Behar", "Krishnanagar", "Suri", "Kolkata", "Jadabpur", 
  "Panskura", "Siliguri", "Haldia", "Garia", "Ghatakpukur", "Gariahat", 
  "Bagan", "Kolkata", "Dum Dum", "Kalyani", "Shibpur", "Chinsurah", 
  "Nabadwip", "Santiniketan", "Burdwan", "Dhanbad", "Jhargram", 
  "Puruliya", "Kolkata"],

  "Andaman and Nicobar Islands": ["Port Blair", "Diglipur", "Havelock Island", "Neil Island", "Car Nicobar", 
  "Campbell Bay", "Rangat", "Mayabunder", "South Andaman", "North Andaman", 
  "Little Andaman", "Baratang", "Kamorta", "Katchal", "Nancowry", "Bambooflat", 
  "Aberdeen Bazaar", "Tamarind Camp", "Long Island", "Lalaji Bay", "Corbyn's Cove", 
  "Wandoor", "Garmur", "Cuffe Parade", "Yerrata", "Chatham", "Madhuban", 
  "Great Nicobar"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa", "Vapi", "Dadra", "Nagar Haveli", "Daman Ganga", 
  "Somnath", "Kachigam", "Moti Daman", "Nani Daman", "Vapi", "Garmur", 
  "Narmada", "Kiranpur", "Dhabhali", "GIDC", "Khanvel", "Vapi", "Kaprada"],
  "Lakshadweep": ["Kavaratti", "Minicoy", "Agatti", "Andrott", "Suheli Par", "Kalapeni", 
  "Suwarai", "Cheriyapalam", "Seychelles", "Maliku", "Kiltan", "Kunjithapam", 
  "Parali", "Thinnakara", "Tinnakara", "Amini", "Bangaram", "Kadmat", "Kalapeni"],
  "Delhi": ["New Delhi", "Delhi", "North Delhi", "South Delhi", "East Delhi", 
  "West Delhi", "Central Delhi", "North East Delhi", "North West Delhi", 
  "South West Delhi", "Shahdara", "Dwarka", "Rohini", "Janakpuri", 
  "Preet Vihar", "Vikaspuri", "Pitampura", "Mundka", "Rajouri Garden", 
  "Saket", "Hauz Khas", "Connaught Place", "Kalkaji", "Lajpat Nagar", 
  "Karol Bagh", "Paharganj", "Chandni Chowk", "Jangpura", "Zakir Nagar"],
  "Puducherry": ["Puducherry", "Karaikal", "Yanam", "Mahe", "Auroville", "Pondicherry", 
  "Villupuram", "Nellikuppam", "Cuddalore", "Kalapet", "Thirunallar", 
  "Nedungadu", "Kottakuppam", "Karaikal", "Bharathidasan Nagar", 
  "Narmathapuram", "Gingee", "Tiruvannamalai", "Muthialpet", "Tindivanam"]
};


const UploadMediaFile = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [gender, setGender] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [transportationMode, setTransportationMode] = useState('');
  const [description, setDescription] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailTimer, setEmailTimer] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // Add successMessage state
  const [phoneError, setPhoneError] = useState(''); // Add phoneError state

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setImage(URL.createObjectURL(acceptedFiles[0]));
    },
  });

  const uploadMedia = async () => {
    setUploading(true);
    setSuccessMessage(''); // Clear any previous success message
    setPhoneError(''); // Clear any previous phone error message

    try {
      const phoneQuerySnapshot = await firestore
        .collection('users')
        .where('contactNumber', '==', contactNumber)
        .get();

      if (!phoneQuerySnapshot.empty) {
        setPhoneError('You have already submitted the feedback');
        setUploading(false);
        return;
      }

      let downloadURL = null;
      if (image) {
        const blob = await fetch(image).then((r) => r.blob());
        const filename = image.split('/').pop();
        const ref = storage.ref().child(filename);
        await ref.put(blob);
        downloadURL = await ref.getDownloadURL();
      }

      const userRef = firestore.collection('users').doc();

      await userRef.set({
        name: name,
        ...(email && { email: email }),
        contactNumber: contactNumber,
        gender: gender,
        state: state,
        city: city,
        transportationMode: transportationMode,
        description: description,
        imageUrl: downloadURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      setUploading(false);
      setSuccessMessage('Feedback submitted successfully!'); // Show success message
      setImage(null);
      setName('');
      setEmail('');
      setContactNumber('');
      setGender('');
      setState('');
      setCity('');
      setTransportationMode('');
      setDescription('');
    } catch (error) {
      console.error('Error uploading data: ', error);
      setUploading(false);
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    if (state) {
      setCities(states[state] || []);
    }
  }, [state]);

  const handlePhoneNumberChange = (event) => {
    const text = event.target.value;
    if (/^\d{0,10}$/.test(text)) {
      setContactNumber(text);
    } else {
      alert('Phone number must be 10 digits.');
    }
  };

  const handleEmailChange = (event) => {
    const text = event.target.value;
    setEmail(text);

    if (emailTimer) {
      clearTimeout(emailTimer);
    }

    setEmailTimer(
      setTimeout(() => {
        if (text && !validateEmail(text)) {
          setEmailError(true);
        } else {
          setEmailError(false);
        }
      }, 1000)
    );
  };

  return (
    <div className="upload-media-file-container">
      <header className="header">
        <h1 className="heading">Feedback Form</h1>
      </header>
      <div className="form-container">
        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input"
          placeholder="Email Address"
          value={email}
          onChange={handleEmailChange}
          type="email"
        />
        {emailError && <div className="error">Invalid Email Address</div>}
        <input
          className="input"
          placeholder="Contact Number"
          value={contactNumber}
          onChange={handlePhoneNumberChange}
          type="tel"
        />
        {phoneError && <div className="error">{phoneError}</div>}
        <select
          className="picker"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <select
          className="picker"
          value={state}
          onChange={(e) => setState(e.target.value)}
        >
          <option value="">State</option>
          {Object.keys(states).map((stateName) => (
            <option key={stateName} value={stateName}>
              {stateName}
            </option>
          ))}
        </select>
        <select
          className="picker"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={cities.length === 0}
        >
          <option value="">City</option>
          {cities.map((cityName) => (
            <option key={cityName} value={cityName}>
              {cityName}
            </option>
          ))}
        </select>
        <label className="travel-label">How are you traveling?</label>
        <select
          className="picker"
          value={transportationMode}
          onChange={(e) => setTransportationMode(e.target.value)}
        >
          <option value="solo">Solo</option>
          <option value="family">Family</option>
          <option value="friends">Friends</option>
          <option value="solo_biker">Solo Biker</option>
          <option value="bikers_group">Biker's Group</option>
        </select>
        <textarea
          className="input description-input"
          placeholder="Feedback"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop an image here, or click to select one</p>
        </div>
        {image && <img src={image} alt="Preview" className="image-preview" />}
        <button className="submit-button" onClick={uploadMedia}>
          {uploading ? 'Uploading...' : 'Submit'}
        </button>
        {successMessage && <div className="success">{successMessage}</div>}
      </div>
    </div>
  );
};

export default UploadMediaFile;
