DOCKER_IMG ?= "function-distance-finder"
DOCKER_USER ?= ""

TAG_NAME = "${DOCKER_IMG}"
ifneq ($(DOCKER_USER), "")
TAG_NAME = "${DOCKER_USER}/${DOCKER_IMG}"
endif

build:
# 	Build the container
	docker build --file ./template/Dockerfile --tag ${TAG_NAME}:latest .
	docker build --file ./template/Dockerfile.armhf --tag ${TAG_NAME}:latest-armhf .

	$(eval VERSION := $(shell make version))
	@echo ${VERSION}

	docker tag ${TAG_NAME}:latest ${TAG_NAME}:${VERSION}
	docker tag ${TAG_NAME}:latest.armhf ${TAG_NAME}:${VERSION}-armhf
.PHONY: build

install:
	npm install
	cd function && npm install
.PHONY: install

publish:
	$(eval VERSION := $(shell make version))
	@echo ${VERSION}

	docker push ${TAG_NAME}:latest
	docker push ${TAG_NAME}:${VERSION}

	docker push ${TAG_NAME}:latest-armhf
	docker push ${TAG_NAME}:${VERSION}-armhf
.PHONY: publish

test:
	cd function && npm test
.PHONY: test

version:
	@echo $(shell ./node_modules/.bin/json -f ./package.json -a version)
.PHONY: version
