---
layout: post
title:  "Tourism Improved"
date:   2014-09-11
categories: Idea
annotation: Big ideas
---

####**Problem statement**  
India is one of the countries having a diverse cultural heritage and thus a wide variety of tourist places. Some of those are still not up to their full potential to be a contributing factor to the India's economy like other recognized tourist spots. Our tool is focused on the improvement of same tourist places in India which have potential to generate a very good revenue but not generating it. Improvement is suggested on the basis of the previous data of the famous tourist places and present data of the tourist place to be improved.

####**What data we are using?**

Whatever data we are using is publicly available. Various sources for the availability of data are listed here,

**1. Governmental Data**  
    There is a lot of data available provided by the government in various forms. Data like facts and figures related to the tourism in India and state wise data; data like categorization of various Tourist places for eg. Historical, Religious, Hill Stations, Adventure etc. Some data sources available to us are,

1. Datagov.in  
        Here we have data available in various formats like pdf, xlsx, csv etc.  
2. State Tourism websites (delhitourism.gov.in etc)  
        Here we have data in the form of HTML pages which can be fetched using simple python scripts.  
3. Tourism.gov.in  
        Here too, we have data in the form of HTML pages which can be fetched using simple python scripts.  

**2. [Google Maps API](https://developers.google.com/maps/documentation/api-picker)**  
    To determine nearby-places, transit routes, traffic details, name of location, distances of the nearby-places from the Tourist places and other places around the Tourist Places we use Google Maps API. Here the data we get is in json which can easily be used. Here are a few sub-APIs under the Google Maps API,

1. [Transit Layer](https://developers.google.com/maps/documentation/javascript/trafficlayer#transit_layer)  
2. [Bicycle layer](https://developers.google.com/maps/documentation/javascript/trafficlayer#bicycling_layer)  
3. [Traffic layer](https://developers.google.com/maps/documentation/javascript/trafficlayer)  
4. [Geocoding service](https://developers.google.com/maps/documentation/javascript/geocoding)  
5. [Google Places API](https://developers.google.com/places/documentation/search)  
6. [Directions service](https://developers.google.com/maps/documentation/javascript/directions)  
7. [Google Places library](https://developers.google.com/maps/documentation/javascript/places)  
8. [Distance Matrix service](https://developers.google.com/maps/documentation/javascript/distancematrix)  
9. [Google Maps Embed API](https://developers.google.com/maps/documentation/embed/)  
10. [Google Maps Tracks API](https://developers.google.com/maps/documentation/tracks)  

**3. Google images**  
    To determine the relative aesthetic beauty of a place we will have Google images which can tell us how much a Tourist place might appear to be beautiful to a tourist.

**4. Travel Agent websites**  
    These travel websites have a lot of data about the Hotels in the locality of the tourist place, various details about the conveyance around the tourist place,  

* [Goibibo](http://www.goibibo.com/)  
* [Makemytrip](http://www.makemytrip.com/)

**5. Restaurants/Food reviewing sites**  
    The data for the availability of good reliable restaurants around the tourist place is determined using these reviewing sites along with Google maps API. A famous site in India is [Zomato](https://www.zomato.com/) which can be used for the application.

**6. Wikipedia**  
    Here we have reliable data available for us in the form of HTML pages. These can be easily parsed and looked for the facts and figures. In spite of being written in natural language all the wiki pages are written in the encyclopedic tone for which the tool can be trained to extract some relevant bits of information like nearby places, images, tourism figures etc.

If our application can be fed a proper dataset for the available famous tourists places then it'll do a much better analysis.

####**How are we solving the above stated problem?**

To determine what changes we have to do in a particular tourist place we have divided the improvements in 7 classes,

**1. Category of the tourist place**  
    We have taken 5 categories-  

*  Historical (eg. Red Fort, Taj Mahal, etc)  
*  Religious (eg. Akshardham Temple, Kedar Nath, Jama Masjid, etc)  
*  Hill Stations (eg. Nainital, Ranikhet, etc)  
*  Adventure (eg. Gangotri, Gulmarg, etc)  
*  Cultural (eg. Kanyakumari, Mohali, etc)  

On the basis of above five categories we ask the user, in which category his tourist place lies in. This step decides the dataset which we will be using to create a base for the comparison.

**2. Accommodation**  
This class contains the analysis on the basis of the Hotels and Motels around the tourist place. We determine the characteristics of a tourist place by determining the number of Hotels (5 star, 3 star, other than 3 star) and Motels around the place and their reviews/ratings.

**3. Conveyance**  
This class contains the analytics of the,  

* Bus routes  
* Availability of local buses  
* Location of bus stops around the tourist place  
* Taxi availability  

Thus, here we create a measurement index for the tourist place on the basis of the conveyance.

**4. Near-by Places**  
Here we look for the following near-by places,  

* Museums  
* Art Galleries  
* Local handicrafts markets  
* Malls  
* Temples  
* Other markets  
* Other famous places  

    One can easily see the connection between the tourist places and these near-by places. One is bound to visit these places if he visited the place. And more the number of these places, more the number of visitors to the place. This is thus one of the judging criteria.

**5.  Overall beauty**  
To determine the relative aesthetic beauty of a place we have two things which can tell us how much a Tourist place might appear to be beautiful to a tourist.  

* User Reviews  
* Google Images  

In the case of user reviews we have various reviews/feedbacks provided by the tourists on various tourist places. Now, the challenges here are that we can never rely on the user reviews; unavailability of an authentic user review system/platform; and even if we cover the previous two issues then we have the reviews written in natural language by a human. So, here the sort of measurement of this aesthetic beauty is very difficult. Hence, the second case.

In second case we have images downloaded from Google. For each tourist place we will be having various images available for us snapped at different angles and distances. By applying image processing methods me will be determining the index as explained below.

The overall beauty is usually due to the combined affects of architecture of the place, scenic beauty, cleanliness of the place, etc. These points are considered to determine how much numerically beautiful a place is. Here too we have categories to determine the measurement of beauty,

* Surrounded by trees and greenery  
* Well maintained place with paths and cleanliness

This above approach is a very basis approach in the sense of determining the score on the basis of 2 factors. This class needs to be more researched upon. With the knowledge we have presently we could only come up with these 2 factors.

####BASE Set for comparison  

For base set we take some famous places we know of under each category and gather their data from all the sources specified above.
For the creation of the above set we consider each category, and under each category we gather data for the following,

**Accommodation**  
    To get data for accommodation we are using Google Maps API, travel agent websites and Governmental data. Here, we create a statistics from the data and come-up with an index with facts and figures. We also come up with an average value for all the index values of the famous places in that category.

**Conveyance**  
    For the conveyance information, the data will be fetched via Google Maps API and travel agent websites and Governmental tourism sites. With this information on the various factors as stated above a set of values are determined for a place. The average of these values for all the places in the category is also calculated.

**Near-by Places**  
    Again the data for this is fetched using Google Maps API, Governmental data, Restaurants/Food reviewing sites and wikipedia. Creating a sort of graph where the tourist place is the center and the near-by places connected to the center we can see that a denser graph implies that there are more number of near-by places that might interest the tourists and thus more revenue generation of that region. Thus the density of the graph is going to be a deciding factor here.

**Overall beauty**  
    The data of the above factors specified in this class will be extracted from the downloaded Google images of a place and wikipedia. On the basis of factors a score will be generated for each place. factors like presence of green color or the uniformity of the color of the structure (signifying the maintenance of the structure by repainting, etc).


####USER's Data Set  

To determine the results of our tool, that is to determine the changes to be suggested for the user's provided tourist place to increase the footfall there we will need some data to be provided by the user. The required data needed is,

**Category of the tourist attraction**  
    We will ask for the category of the place user wants us to compare, this will enable our application to have a smaller master data set and better results.  
    If other than the five categories is specified then the master dataset will be comprising of the whole data set. That is all the places irrespective of the category.

**Accommodation Facility**  
    Here we will ask for the excel sheets in a specified format for the details of the Hotels present around the tourist place so that we know how much is already present there. For each class of hotel (5 star, 4 star, 3 star etc) the data will be taken so that we know how much active the place is.

**Average Footfall**  
    Footfall can be entered in three modes  
*Daily  
*Monthly  
*Yearly  
    After this mode an excel sheet should be given having the data according to the mode for the footfall. For eg. daily footfall for last 18 months or monthly data for last 48 months and so on.

**Location**  
    Latitudes and longitudes of the tourist place will be asked here. This step is to determine the place of the location on the maps and leverage the Google Maps API and use the data fetched to derive the results.

**Images**  
    Here at least 10 images at at 10 different angles (one from each side, one from each corner and 2 from top) of the tourist place will be asked so that we can determine the aesthetic measurements of the place.

####REPORT  
Now, after the analysis is done the report will be generated. Report will comprise of a graphical representation of the things lacking in the tourist attraction when compared with the places in the corresponding category.
Along, with the graph a set of suggestions will be provided in the four points in which the places are compared that is, Accommodation, Conveyance, Near-by Places and Overall beauty. With each suggestion supporting data will also be shown so that user does not think that we were trolling him. That the results are actually based on the real data of real places.
There is also an option with which you can print/export this generated report to have a hard copy.

I'll have to start developing on this idea and implement it for the results. Lets see how it goes.

SR.