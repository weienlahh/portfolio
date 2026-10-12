source("wrappers.R")
source("my.prediction.stats.R")
library(rpart)
library(glmnet)
#1
heart.train = read.csv("heart.train.ass3.2025.csv",stringsAsFactors = T,header = TRUE)
summary(heart.train)

tree.heart = rpart(HD~.,heart.train)
tree.heart
cv = learn.tree.cv(HD~.,heart.train,nfolds = 10,m = 5000)
cv$best.tree

#2,3
png("decision_tree.png", width = 1000, height = 800)
plot(cv$best.tree)
text(cv$best.tree,pretty = 12)
dev.off()

#4,5,6
fullmod = glm(HD~.,data = heart.train,family = binomial)
fullmod.kic = step(fullmod,direction = "both",k = 3)
summary(fullmod.kic)

#7
heart.test = read.csv("heart.test.ass3.2025.csv",stringsAsFactors = T,header = TRUE)

pred.sw = predict(fullmod.kic,heart.test,type = "response")
stats.sw = my.pred.stats(pred.sw,heart.test$HD)

pred.tree = predict(cv$best.tree,heart.test,type = "class")

stats.tree = my.pred.stats(pred.tree.numeric,heart.test$HD)

#8a
pred.tree.prob = predict(cv$best.tree,heart.test[10,],type = "prob") #probability is returned
print("For patient 10, P(N),P(Y):")
print(pred.tree.prob)

odds.tree = pred.tree.prob[2]/(1-pred.tree.prob[2]) #Odds = p/(1-p)
odds.tree

#8b
pred.sw.logodds = predict(fullmod.kic,heart.test[10,]) #log-odds value is returned
pred.sw.logodds
odds.sw = exp(pred.sw.logodds) #so I use exp() here
odds.sw

#9
#For this question, I bootstraps the difference in odds of two patients directly to have a confidence 
#interval that is more useful.
boot.func = function(data,indices) {
  #Create bootstrapped version of data
  d = data[indices,]
  
  #Fit the KIC model from Q5
  fit = glm(HD ~ SEX + CP + TRESTBPS + CHOL + OLDPEAK + SLOPE + CA,data = d,family = binomial)
  
  #Compute the probabilities for patient 65 and 66
  pred.probs = predict(fit,heart.test[c(65,66),],type = "response")
  
  #Convert the probabilities to odds
  odds_65 = pred.probs[1]/(1-pred.probs[1])
  odds_66 = pred.probs[2]/(1-pred.probs[2])
  
  #Return the difference in their odds.
  return (odds_65-odds_66)
}

set.seed(77)

boot.result = boot(heart.train,statistic = boot.func,R = 5000)

boot.ci(boot.result,type ="bca")
