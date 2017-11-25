ARCH ?= ""
DOCKER_IMG ?= "distance-finder"
DOCKER_USER ?= ""

ifeq ($(ARCH), armhf)
ARCH_DOCKER := ".armhf"
ARCH_TAG := "-armhf"
endif

build:
	# Build the container
	docker build --file ./template/Dockerfile${ARCH_DOCKER} --tag ${DOCKER_USER}/${DOCKER_IMG}:latest${ARCH_TAG} .
.PHONY: build

install:
	npm install
	cd function && npm install
.PHONY: install

publish:
	docker push ${DOCKER_USER}/${DOCKER_IMG}:latest${ARCH_TAG}
.PHONY: publish
