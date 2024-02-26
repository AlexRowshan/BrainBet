FROM ubuntu:22.04
RUN apt-get update && apt-get install -y openjdk-17-jdk maven wget git
RUN wget https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz
RUN tar -xvf apache-maven-3.9.6-bin.tar.gz
RUN cp -r apache-maven-3.9.6 /opt
ENV PATH "/opt/apache-maven-3.9.6/bin:${PATH}"

VOLUME ["/root/.m2", "/usr/local/310-project"]
WORKDIR /usr/local/310-project
#CMD ["bash"]
