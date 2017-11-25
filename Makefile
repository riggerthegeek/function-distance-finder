ARCH ?= ""
DOCKER_IMG ?= "function-distance-finder"
DOCKER_USER ?= ""

ifeq ($(ARCH), armhf)
ARCH_DOCKER := ".armhf"
ARCH_TAG := "-armhf"
endif

TAG_NAME = "${DOCKER_IMG}"
ifneq ($(DOCKER_USER), "")
TAG_NAME = "${DOCKER_USER}/${DOCKER_IMG}"
endif

build:
# 	Build the container
	docker build --file ./template/Dockerfile${ARCH_DOCKER} --tag ${TAG_NAME}:latest${ARCH_TAG} .

	$(eval VERSION := $(shell ./node_modules/.bin/json -f ./package.json -a version))
	@echo ${VERSION}

	docker tag ${TAG_NAME}:latest${ARCH_TAG} ${TAG_NAME}:${VERSION}${ARCH_TAG}
.PHONY: build

install:
	npm install
	cd function && npm install
.PHONY: install

publish:
	docker push ${TAG_NAME}:latest${ARCH_TAG}
.PHONY: publish

test:
	cd function && npm test
.PHONY: test
