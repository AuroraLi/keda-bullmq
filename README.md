# Use BullMQ and Keda for task management and scheduling

## Install
Install Keda to GKE
```
kubectl apply --server-side -f https://github.com/kedacore/keda/releases/download/v2.11.2/keda-2.11.2.yaml
```

Install Redis HPA on Keda:
```
export REDIS_IP=$(gcloud redis instances list --filter="name:myinstance " --format="value(HOST)" \
    --region=us-central1)
sed "s|REDIS_IP|${REDIS_IP}|g" redis-hpa.yaml | kubectl apply -f -
```

Install Redis Insights to view Redis data:
```
kubectl apply -f redisinsights.yaml
```
Go to the webpage for Redis Insights and set up the connectivity for Redis instance.

Update deployment file with Redis IP:
```
sed -i '' "s|REDIS_IP|\"${REDIS_IP}\"|g" provider/provider.yaml
sed -i '' "s|REDIS_IP|\"${REDIS_IP}\"|g" consumer/consumer.yaml
```

Create Provider app in the cluster:
```
cd provider
skaffold run --default-repo <YOUR ARTIFACT REPO>
cd ..
```

Create Consumer app in the cluster:
```
cd consumer
skaffold run --default-repo <YOUR ARTIFACT REPO>
cd ..
```

## Test
Get the external IP for the provider:
```
PROVIDER_IP=$(kubectl get svc node -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
```

Send post requests:
```
i=0 ; while true ; do curl -o /dev/null -X POST -s http://${PROVIDER_IP}:8080/ ; if [ $? -ne 0 ] ; then echo $i ; break ; fi ; i=$(($i+1)) ; echo -en "$i        \r" ; sleep 1 ; done
```

Check if the consumer deployment is scaling up:
```
kubectl get hpa -w
```

Check in Redis Insights on data updates. 