DOCKER_IMG ?= "function-distance-finder"
DOCKER_USER ?= ""

TAG_NAME = "${DOCKER_IMG}"
ifneq ($(DOCKER_USER), "")
TAG_NAME = "${DOCKER_USER}/${DOCKER_IMG}"
endif

build:
# 	Build the container
	docker build --file ./Dockerfile --tag ${TAG_NAME}:latest .

	$(eval VERSION := $(shell make version))
	@echo ${VERSION}

	docker tag ${TAG_NAME}:latest ${TAG_NAME}:${VERSION}
.PHONY: build

build-armhf:
# 	Build the container
	docker build --file ./Dockerfile.armhf --tag ${TAG_NAME}:latest-armhf .

	$(eval VERSION := $(shell make version))
	@echo ${VERSION}

	docker tag ${TAG_NAME}:latest-armhf ${TAG_NAME}:${VERSION}-armhf
.PHONY: build-armhf

install:
	npm install
	cd function && npm install
.PHONY: install

publish:
	$(eval VERSION := $(shell make version))
	@echo ${VERSION}

	docker push ${TAG_NAME}:latest
	docker push ${TAG_NAME}:${VERSION}
.PHONY: publish

publish-armhf:
	$(eval VERSION := $(shell make version))
	@echo ${VERSION}

	docker push ${TAG_NAME}:latest-armhf
	docker push ${TAG_NAME}:${VERSION}-armhf
.PHONY: publish-armhf

test:
	cd function && npm test
.PHONY: test

version:
	@echo $(shell ./node_modules/.bin/json -f ./package.json -a version)
.PHONY: version
