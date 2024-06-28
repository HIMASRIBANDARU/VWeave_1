FROM 989431465196.dkr.ecr.ap-south-1.amazonaws.com/vg-base:npm-9.6.6-alpine
RUN apk add --update npm ffmpeg
COPY app /opt/app
WORKDIR /opt/app
RUN rm -rf package-lock.json
RUN npm install --force
EXPOSE 3000
CMD ["./run.sh"]