rm(list=ls())
#1
fuel_data = read.csv('fuel.ass3.2025.csv')
head(fuel_data)
fit=lm(Comb.FE~.,fuel_data)
summary(fit)

#2,3
num_predictors = 9
alpha = 0.05

bonferroni_alpha = alpha / num_predictors

#4
fit.sw.bic = step(fit,direction = "both",k = log(length(fuel_data$Comb.FE)))
summary(fit.sw.bic)

#5a,5b
new_car_data = fuel_data[33,]
my.pred.stats = predict(fit.sw.bic,new_car_data,interval = "confidence",level = 0.95)
my.pred.stats