rm(list=ls())
library(kknn)
library(boot)
#1
truth_data = read.csv("ms.truth.2025.csv",header = TRUE)
measured_data = read.csv("ms.measured.2025.csv",header = TRUE)

k_vals = 1:25
rmse_vals = numeric(length(k_vals)) #Create an empty vector to store rmse value later

knn = train.kknn(intensity~MZ, data = measured_data, kmax=25, kernel="optimal")

for (k in k_vals){
  
  #Fit knn model
  fit.kknn = kknn(intensity~MZ, train = measured_data,test = truth_data,k = k,kernel="optimal")
  
  #Get the predicted intensity
  predicted_intensity = fit.kknn$fitted.values
  
  #Get the true intensity
  true_intensity = truth_data$intensity
  
  #Calculate RMSE
  rmse = sqrt(mean((predicted_intensity - true_intensity)^2))
  
  rmse_vals[k] = rmse
}

#Start plotting
plot(k_vals,rmse_vals,
     col = "red",
     xlab = "Values of k",
     ylab = "Root-mean-squared error",
     main = "k-NN model performance for different k values")

#2
k_vals_plot = c(2,6,12,25)

for (k in k_vals_plot){
  fit.kknn = kknn(intensity~MZ,
                  train = measured_data,
                  test = truth_data,
                  k = k,
                  kernel = "optimal")
  
  predicted_intensity = fit.kknn$fitted.values
  
  #Plot and save the graph with unique filename using paste0()
  png(filename = paste0("kNN_plot_k=", k, ".png"))
  
  plot(measured_data$MZ,measured_data$intensity,
       col = "gray",
       xlab = "Mass-to-Charge Ratio (MZ)",
       ylab = "Intensity",
       main = paste("k-NN smoothing with k=",k))
  
  lines(truth_data$MZ,truth_data$intensity,
        col = "black",
        lwd = 2) # make the line thicker
  
  lines(truth_data$MZ,predicted_intensity,
        col = "red",
        lwd = 2,
        ) 
  
  legend("topright",
         legend = c("Training Data","True Intensity","k-NN Estimate Intensity"),
         col = c("gray","black","red"),
         lty = c(NA,1,1),
         pch = c(19,NA,NA),
         )
  #Close the graph everytime we end the loop
  dev.off()
}

#4
knn = train.kknn(intensity~MZ,measured_data,kmax = 25,kernel = "optimal")
knn$best.parameters$k

#I calculate out the RMSE of k=6 and k=7 for question 3.1 to determine which gives lowest RMSE.
rmse_vals[6]
rmse_vals[7]
#Find out when k = 7, RMSE is the lowest so it is the same with the result of optimal kernel k-NN model.

#5
best_k = 7 # from the result of question 4
estimate.kknn = kknn(intensity~MZ,
                     train = measured_data,
                     test = truth_data,
                     k = best_k,
                     kernel = "optimal")

estimated_intensity = estimate.kknn$fitted.values
measured_intensity = measured_data$intensity

noise = measured_intensity - estimated_intensity

noise_sd_estimate = sd(noise)

#7
#We have fit the k-NN model using k=7 in question 6 so I will just continue the rest of it.
#We have found the smoothed signal (estimated_intensity)
#Now we need to find the max value and the index of it.
max_intensity = max(estimated_intensity)
index_of_max = which.max(estimated_intensity)

#Find the corresponding MZ value from truth_data
mz_max_intensity = truth_data$MZ[index_of_max]
mz_max_intensity

#8
  #Write a code that can generate 95% ci at any specific MZ value 
  #Define the bootstrap function first
  get_intensity_ci = function(train_data,k_value,mz_value,R = 5000){
    
    boot_func = function(data,indices){
      boot_data = data[indices,]
      
      #Fit a k-NN model on the bootstrap sample
      fit.boot = kknn(intensity~MZ,
                      train = boot_data,
                      test = data.frame(MZ = mz_value), #Create data frame ourselves
                      k = k_value)
      
      return(fit.boot$fitted.values)
    }
    
    #Run bootstrap
    
    set.seed(77)
    
    boot_result = boot(data = measured_data,
                       statistic = boot_func,
                       R = 5000)
    ci = boot.ci(boot_result,type = "bca")
    
  }
  #A general 'tool' that return 95% ci of estimate of intensity for specific mz value is done here.
  
  #Now solve the rest of the question, which is just using the tool above with required k values and mz values.
  k_bootstrap_vals = c(7,3,20)
  
  for (k in k_bootstrap_vals){
    confidence_interval = get_intensity_ci(train_data = measured_data,k_value = k,mz_value = mz_max_intensity)
    print(paste("===== CONFIDENCE INTERVAL FOR k =", k, "====="))
    
    print(confidence_interval)
  }

