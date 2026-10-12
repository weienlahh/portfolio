// *****PLEASE ENTER YOUR DETAILS BELOW*****
// T6-brm-mongo.mongodb.js

// Student ID: 36376086
// Student Name: Ng Wei En

// ===================================================================================
// DO NOT modify or remove any of the comments below (items marked with //)
// Do not use .pretty() in your code, it is not required
//
// -- Submission Declaration - must not be removed - removal will result in no marks being awarded --
// In submitting this SQL script, I confirm that this is my own work without coding assistance from Generative AI
// ===================================================================================

// Use (connect to) your database - you MUST update xyz001
// with your authcate username

//use("abc001");
use("wngg0080");
// (b)
// PLEASE PLACE REQUIRED MONGODB COMMAND TO CREATE THE COLLECTION HERE
// YOU MAY PICK ANY COLLECTION NAME
// ENSURE that your query is formatted and has a semicolon
// (;) at the end of this answer

// Drop collection
db.brm_customer_quotes.drop();


// Create collection and insert documents
db.createCollection("brm_customer_quotes");
db.brm_customer_quotes.insertMany([
    { "_id": 1, "customer_name": "Michael Benjamin", "customer_business": "FreshBox", "customer_address": "55 Lonsdale Street, Melbourne, 3008", "customer_phone": "0478901017", "customer_stats": { "number_of_quotes": 2, "number_of_jobs": 1, "total_paid_jobcost": "$1,800.00", "total_unpaid_jobcost": "-" }, "quotes": [{ "quote_no": 1, "quote_prepared_on": "02-May-2026", "preferred_start_date": "08-May-2026", "start_location": "55 Lonsdale Street, Melbourne VIC 3008", "end_location": "10 King Street, Sydney NSW 2000", "quote_cost": "$1,800.00", "assigned_to_job": "Y", "job_cost": "$1,800.00" }, { "quote_no": 21, "quote_prepared_on": "22-May-2026", "preferred_start_date": "10-Jun-2026", "start_location": "55 Lonsdale Street, Melbourne VIC 3008", "end_location": "300 Queen Street, Brisbane QLD 4000", "quote_cost": "$2,700.00", "assigned_to_job": "N", "job_cost": "-" }] },
    { "_id": 2, "customer_name": "James", "customer_business": "J Wood and Gravel", "customer_address": "15 George Street, Sydney, 2000", "customer_phone": "0412345001", "customer_stats": { "number_of_quotes": 2, "number_of_jobs": 1, "total_paid_jobcost": "$2,500.00", "total_unpaid_jobcost": "-" }, "quotes": [{ "quote_no": 2, "quote_prepared_on": "03-May-2026", "preferred_start_date": "10-May-2026", "start_location": "15 George Street, Sydney NSW 2000", "end_location": "20 Queen Street, Brisbane QLD 4000", "quote_cost": "$2,400.00", "assigned_to_job": "Y", "job_cost": "$2,500.00" }, { "quote_no": 26, "quote_prepared_on": "27-May-2026", "preferred_start_date": "20-Jun-2026", "start_location": "15 George Street, Sydney NSW 2000", "end_location": "33 York Street, Sydney NSW 2000", "quote_cost": "$720.00", "assigned_to_job": "N", "job_cost": "-" }] },
    { "_id": 3, "customer_name": "Brook", "customer_business": "Western Chocolatery", "customer_address": "23 Murray Street, Perth, 6000", "customer_phone": "0445678004", "customer_stats": { "number_of_quotes": 2, "number_of_jobs": 1, "total_paid_jobcost": "-", "total_unpaid_jobcost": "$750.00" }, "quotes": [{ "quote_no": 3, "quote_prepared_on": "04-May-2026", "preferred_start_date": "12-May-2026", "start_location": "23 Murray Street, Perth WA 6000", "end_location": "45 Adelaide Terrace, Perth WA 6004", "quote_cost": "$750.00", "assigned_to_job": "Y", "job_cost": "$750.00" }, { "quote_no": 30, "quote_prepared_on": "31-May-2026", "preferred_start_date": "30-Jun-2026", "start_location": "23 Murray Street, Perth WA 6000", "end_location": "6 Lily Street, Canberra ACT 2601", "quote_cost": "$3,100.00", "assigned_to_job": "N", "job_cost": "-" }] },
    { "_id": 4, "customer_name": "Alexander Noah", "customer_business": "-", "customer_address": "56 Bourke Street, Melbourne, 3001", "customer_phone": "0478901007", "customer_stats": { "number_of_quotes": 2, "number_of_jobs": 1, "total_paid_jobcost": "$600.00", "total_unpaid_jobcost": "-" }, "quotes": [{ "quote_no": 4, "quote_prepared_on": "05-May-2026", "preferred_start_date": "15-May-2026", "start_location": "56 Bourke Street, Melbourne VIC 3001", "end_location": "90 Collins Street, Melbourne VIC 3000", "quote_cost": "$650.00", "assigned_to_job": "Y", "job_cost": "$600.00" }, { "quote_no": 22, "quote_prepared_on": "23-May-2026", "preferred_start_date": "11-Jun-2026", "start_location": "56 Bourke Street, Melbourne VIC 3001", "end_location": "1 Macquarie Street, Sydney NSW 2000", "quote_cost": "$2,300.00", "assigned_to_job": "N", "job_cost": "-" }] },
    { "_id": 5, "customer_name": "Jack Ethan", "customer_business": "-", "customer_address": "61 Ann Street, Brisbane, 4101", "customer_phone": "0434567013", "customer_stats": { "number_of_quotes": 1, "number_of_jobs": 1, "total_paid_jobcost": "$700.00", "total_unpaid_jobcost": "-" }, "quotes": [{ "quote_no": 5, "quote_prepared_on": "06-May-2026", "preferred_start_date": "16-May-2026", "start_location": "61 Ann Street, Brisbane QLD 4101", "end_location": "88 Creek Street, Brisbane QLD 4000", "quote_cost": "$700.00", "assigned_to_job": "Y", "job_cost": "$700.00" }] },
    { "_id": 6, "customer_name": "Sophie Amelia", "customer_business": "-", "customer_address": "29 Barrack Street, Perth, 6009", "customer_phone": "0445678014", "customer_stats": { "number_of_quotes": 1, "number_of_jobs": 1, "total_paid_jobcost": "-", "total_unpaid_jobcost": "$900.00" }, "quotes": [{ "quote_no": 6, "quote_prepared_on": "07-May-2026", "preferred_start_date": "18-May-2026", "start_location": "29 Barrack Street, Perth WA 6009", "end_location": "60 Hay Street, Perth WA 6000", "quote_cost": "$850.00", "assigned_to_job": "Y", "job_cost": "$900.00" }] },
    { "_id": 7, "customer_name": "Kate Evelyn", "customer_business": "Miller Co.", "customer_address": "72 Cavill Avenue, Brisbane, 4217", "customer_phone": "0489012018", "customer_stats": { "number_of_quotes": 2, "number_of_jobs": 1, "total_paid_jobcost": "$2,550.00", "total_unpaid_jobcost": "-" }, "quotes": [{ "quote_no": 7, "quote_prepared_on": "08-May-2026", "preferred_start_date": "20-May-2026", "start_location": "72 Cavill Avenue, Brisbane QLD 4217", "end_location": "110 George Street, Sydney NSW 2000", "quote_cost": "$2,600.00", "assigned_to_job": "Y", "job_cost": "$2,550.00" }, { "quote_no": 27, "quote_prepared_on": "28-May-2026", "preferred_start_date": "22-Jun-2026", "start_location": "72 Cavill Avenue, Brisbane QLD 4217", "end_location": "55 Lonsdale Street, Melbourne VIC 3008", "quote_cost": "$2,750.00", "assigned_to_job": "N", "job_cost": "-" }] },
    { "_id": 8, "customer_name": "Emma", "customer_business": "Kreate Curtain", "customer_address": "42 Collins Street, Melbourne, 3000", "customer_phone": "0423456002", "customer_stats": { "number_of_quotes": 2, "number_of_jobs": 1, "total_paid_jobcost": "$500.00", "total_unpaid_jobcost": "-" }, "quotes": [{ "quote_no": 8, "quote_prepared_on": "09-May-2026", "preferred_start_date": "22-May-2026", "start_location": "42 Collins Street, Melbourne VIC 3000", "end_location": "25 Swanston Street, Melbourne VIC 3000", "quote_cost": "$500.00", "assigned_to_job": "Y", "job_cost": "$500.00" }, { "quote_no": 23, "quote_prepared_on": "24-May-2026", "preferred_start_date": "12-Jun-2026", "start_location": "42 Collins Street, Melbourne VIC 3000", "end_location": "70 Elizabeth Street, Melbourne VIC 3000", "quote_cost": "$620.00", "assigned_to_job": "N", "job_cost": "-" }] },
    { "_id": 9, "customer_name": "William", "customer_business": "Best Fruit and Veg", "customer_address": "67 King William Street, Adelaide, 5000", "customer_phone": "0456789005", "customer_stats": { "number_of_quotes": 1, "number_of_jobs": 1, "total_paid_jobcost": "$580.00", "total_unpaid_jobcost": "-" }, "quotes": [{ "quote_no": 9, "quote_prepared_on": "10-May-2026", "preferred_start_date": "23-May-2026", "start_location": "67 King William Street, Adelaide SA 5000", "end_location": "9 North Terrace, Adelaide SA 5000", "quote_cost": "$550.00", "assigned_to_job": "Y", "job_cost": "$580.00" }] },
    { "_id": 10, "customer_name": "Grace", "customer_business": "-", "customer_address": "45 Rundle Mall, Adelaide, 5006", "customer_phone": "0401234010", "customer_stats": { "number_of_quotes": 1, "number_of_jobs": 1, "total_paid_jobcost": "-", "total_unpaid_jobcost": "$600.00" }, "quotes": [{ "quote_no": 10, "quote_prepared_on": "11-May-2026", "preferred_start_date": "24-May-2026", "start_location": "45 Rundle Mall, Adelaide SA 5006", "end_location": "5 Grenfell Street, Adelaide SA 5000", "quote_cost": "$600.00", "assigned_to_job": "Y", "job_cost": "$600.00" }] },
    { "_id": 11, "customer_name": "Rose Isabella", "customer_business": "-", "customer_address": "34 Adelaide Street, Brisbane, 4006", "customer_phone": "0489012008", "customer_stats": { "number_of_quotes": 1, "number_of_jobs": 1, "total_paid_jobcost": "$750.00", "total_unpaid_jobcost": "-" }, "quotes": [{ "quote_no": 11, "quote_prepared_on": "12-May-2026", "preferred_start_date": "27-May-2026", "start_location": "34 Adelaide Street, Brisbane QLD 4006", "end_location": "100 Elizabeth Street, Brisbane QLD 4000", "quote_cost": "$720.00", "assigned_to_job": "Y", "job_cost": "$750.00" }] },
    { "_id": 12, "customer_name": "Robert James", "customer_business": "Wilson Confectionery", "customer_address": "38 Wellington Street, Perth, 6107", "customer_phone": "0490123019", "customer_stats": { "number_of_quotes": 1, "number_of_jobs": 1, "total_paid_jobcost": "$950.00", "total_unpaid_jobcost": "-" }, "quotes": [{ "quote_no": 12, "quote_prepared_on": "13-May-2026", "preferred_start_date": "28-May-2026", "start_location": "38 Wellington Street, Perth WA 6107", "end_location": "20 St Georges Terrace, Perth WA 6000", "quote_cost": "$950.00", "assigned_to_job": "Y", "job_cost": "$950.00" }] },
    { "_id": 13, "customer_name": "Oliver", "customer_business": "Williams Co.", "customer_address": "88 Queen Street, Brisbane, 4000", "customer_phone": "0434567003", "customer_stats": { "number_of_quotes": 1, "number_of_jobs": 1, "total_paid_jobcost": "$700.00", "total_unpaid_jobcost": "-" }, "quotes": [{ "quote_no": 13, "quote_prepared_on": "14-May-2026", "preferred_start_date": "29-May-2026", "start_location": "88 Queen Street, Brisbane QLD 4000", "end_location": "65 Eagle Street, Brisbane QLD 4000", "quote_cost": "$680.00", "assigned_to_job": "Y", "job_cost": "$700.00" }] },
    { "_id": 14, "customer_name": "Price", "customer_business": "Garcia Frozen", "customer_address": "101 Pitt Street, Sydney, 2010", "customer_phone": "0467890006", "customer_stats": { "number_of_quotes": 1, "number_of_jobs": 1, "total_paid_jobcost": "-", "total_unpaid_jobcost": "$800.00" }, "quotes": [{ "quote_no": 14, "quote_prepared_on": "15-May-2026", "preferred_start_date": "30-May-2026", "start_location": "101 Pitt Street, Sydney NSW 2010", "end_location": "200 George Street, Sydney NSW 2000", "quote_cost": "$800.00", "assigned_to_job": "Y", "job_cost": "$800.00" }] },
    { "_id": 15, "customer_name": "Thomas", "customer_business": "-", "customer_address": "78 Hay Street, Perth, 6003", "customer_phone": "0490123009", "customer_stats": { "number_of_quotes": 2, "number_of_jobs": 1, "total_paid_jobcost": "$480.00", "total_unpaid_jobcost": "-" }, "quotes": [{ "quote_no": 15, "quote_prepared_on": "16-May-2026", "preferred_start_date": "31-May-2026", "start_location": "78 Hay Street, Perth WA 6003", "end_location": "90 Murray Street, Perth WA 6000", "quote_cost": "$450.00", "assigned_to_job": "Y", "job_cost": "$480.00" }, { "quote_no": 24, "quote_prepared_on": "25-May-2026", "preferred_start_date": "15-Jun-2026", "start_location": "78 Hay Street, Perth WA 6003", "end_location": "8 Lion Road, Sydney NSW 2000", "quote_cost": "$2,950.00", "assigned_to_job": "N", "job_cost": "-" }] },
    { "_id": 16, "customer_name": "Henry Lucas", "customer_business": "-", "customer_address": "92 Oxford Street, Sydney, 2060", "customer_phone": "0412345011", "customer_stats": { "number_of_quotes": 1, "number_of_jobs": 1, "total_paid_jobcost": "$900.00", "total_unpaid_jobcost": "-" }, "quotes": [{ "quote_no": 16, "quote_prepared_on": "17-May-2026", "preferred_start_date": "02-Jun-2026", "start_location": "92 Oxford Street, Sydney NSW 2060", "end_location": "50 Market Street, Sydney NSW 2000", "quote_cost": "$900.00", "assigned_to_job": "Y", "job_cost": "$900.00" }] },
    { "_id": 17, "customer_name": "Lily Charlotte", "customer_business": "-", "customer_address": "18 Chapel Street, Melbourne, 3004", "customer_phone": "0423456012", "customer_stats": { "number_of_quotes": 2, "number_of_jobs": 1, "total_paid_jobcost": "-", "total_unpaid_jobcost": "$820.00" }, "quotes": [{ "quote_no": 17, "quote_prepared_on": "18-May-2026", "preferred_start_date": "03-Jun-2026", "start_location": "18 Chapel Street, Melbourne VIC 3004", "end_location": "75 Flinders Lane, Melbourne VIC 3000", "quote_cost": "$780.00", "assigned_to_job": "Y", "job_cost": "$820.00" }, { "quote_no": 25, "quote_prepared_on": "26-May-2026", "preferred_start_date": "18-Jun-2026", "start_location": "18 Chapel Street, Melbourne VIC 3004", "end_location": "66 Spencer Street, Melbourne VIC 3000", "quote_cost": "$640.00", "assigned_to_job": "N", "job_cost": "-" }] },
    { "_id": 18, "customer_name": "Victoria Ella", "customer_business": "Flintstone Store", "customer_address": "94 Henley Beach Road, Adelaide, 5095", "customer_phone": "0401234020", "customer_stats": { "number_of_quotes": 3, "number_of_jobs": 1, "total_paid_jobcost": "$820.00", "total_unpaid_jobcost": "-" }, "quotes": [{ "quote_no": 18, "quote_prepared_on": "19-May-2026", "preferred_start_date": "04-Jun-2026", "start_location": "94 Henley Beach Road, Adelaide SA 5095", "end_location": "12 Pirie Street, Adelaide SA 5000", "quote_cost": "$820.00", "assigned_to_job": "Y", "job_cost": "$820.00" }, { "quote_no": 28, "quote_prepared_on": "29-May-2026", "preferred_start_date": "25-Jun-2026", "start_location": "94 Henley Beach Road, Adelaide SA 5095", "end_location": "9 Albatros Drive, Mount Gambier SA 5270", "quote_cost": "$1,000.00", "assigned_to_job": "N", "job_cost": "-" }, { "quote_no": 300, "quote_prepared_on": "17-May-2026", "preferred_start_date": "25-May-2026", "start_location": "29 Kuranda Road, Adelaide SA 5030", "end_location": "9 Albatros Drive, Mount Gambier SA 5270", "quote_cost": "$1,000.00", "assigned_to_job": "N", "job_cost": "-" }] },
    { "_id": 19, "customer_name": "Daniel Mason", "customer_business": "-", "customer_address": "83 Jetty Road, Adelaide, 5063", "customer_phone": "0456789015", "customer_stats": { "number_of_quotes": 1, "number_of_jobs": 1, "total_paid_jobcost": "$790.00", "total_unpaid_jobcost": "-" }, "quotes": [{ "quote_no": 19, "quote_prepared_on": "20-May-2026", "preferred_start_date": "05-Jun-2026", "start_location": "83 Jetty Road, Adelaide SA 5063", "end_location": "40 King William Street, Adelaide SA 5000", "quote_cost": "$760.00", "assigned_to_job": "Y", "job_cost": "$790.00" }] },
    { "_id": 20, "customer_name": "Emily Harper", "customer_business": "-", "customer_address": "127 Parramatta Road, Sydney, 2150", "customer_phone": "0467890016", "customer_stats": { "number_of_quotes": 2, "number_of_jobs": 1, "total_paid_jobcost": "-", "total_unpaid_jobcost": "$1,100.00" }, "quotes": [{ "quote_no": 20, "quote_prepared_on": "21-May-2026", "preferred_start_date": "06-Jun-2026", "start_location": "127 Parramatta Road, Sydney NSW 2150", "end_location": "18 Kent Street, Sydney NSW 2000", "quote_cost": "$1,100.00", "assigned_to_job": "Y", "job_cost": "$1,100.00" }, { "quote_no": 29, "quote_prepared_on": "30-May-2026", "preferred_start_date": "28-Jun-2026", "start_location": "127 Parramatta Road, Sydney NSW 2150", "end_location": "20 Park Street, Sydney NSW 2000", "quote_cost": "$880.00", "assigned_to_job": "N", "job_cost": "-" }] },
]);

// List all documents you added
db.brm_customer_quotes.find();


// (c)
// PLEASE PLACE REQUIRED MONGODB COMMAND/S FOR THIS PART HERE
// ENSURE that your query is formatted and has a semicolon
// (;) at the end of this answer
// List customers with at least two quotes who live in Melbourne.

db.brm_customer_quotes.find(
    {
        "customer_stats.number_of_quotes": { "$gte": 2 },
        "customer_address": /Melbourne/
    },
    {
        "_id": 1,
        "customer_name": 1,
        "customer_address": 1,
        "customer_phone": 1,
        "customer_stats.number_of_quotes": 1,
        "customer_stats.number_of_jobs": 1,
        "customer_stats.total_paid_jobcost": 1,
        "customer_stats.total_unpaid_jobcost": 1
    }
);


// (d)
// PLEASE PLACE REQUIRED MONGODB COMMAND/S FOR THIS PART HERE
// ENSURE that your query is formatted and has a semicolon
// (;) at the end of this answer

// (i)  Add the new customer
db.brm_customer_quotes.insertOne(
    {
        "_id": 1001,
        "customer_name": "Patrick Bosse",
        "customer_business": "-",
        "customer_address": "10 King Street, Adelaide, 5000",
        "customer_phone": "0411222333",
        "customer_stats": {
            "number_of_quotes": 0,
            "number_of_jobs": 0,
            "total_paid_jobcost": "-",
            "total_unpaid_jobcost": "-"
        },
        "quotes": []
    }
);

// Show the customer details

db.brm_customer_quotes.find(
    {
        "_id": 1001
    }
);


// (ii) Add new quote
db.brm_customer_quotes.updateOne(
    {
        "_id": 1001
    },
    {
        "$set": {
            "customer_stats.number_of_quotes": 1,
            "customer_stats.number_of_jobs": 1,
            "customer_stats.total_paid_jobcost": "$3200.00",
            "customer_stats.total_unpaid_jobcost": "-"
        },
        "$push": {
            "quotes": {
                "quote_no": 2002,
                "quote_prepared_on": "01-Jul-2026",
                "preferred_start_date": "05-Jul-2026",
                "start_location": "Adelaide SA",
                "end_location": "Melbourne VIC",
                "quote_cost": "$3200.00",
                "assigned_to_job": "Y",
                "job_cost": "$3200.00"
            }
        }
    }
);

// Show the customer details
db.brm_customer_quotes.find(
    {
        "_id": 1001
    }
);

// End of file - do not remove
