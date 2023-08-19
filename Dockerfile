FROM node:18
ENV DEBIAN_FRONTEND=noninteractive

# Copy client and server into container for building
# RUN mkdir -p /server && mkdir -p /client
RUN apt-get -y update && apt-get -y upgrade && apt-get install -y gettext-base dos2unix

COPY . /server
EXPOSE 3000
CMD ["/bin/bash", "/run.sh"]
