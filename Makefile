DOCKER_IMG ?= function-distance-finder
DOCKER_USER ?=
MANIFEST_CONTAINER = project31/docker-manifest
DOCKER_SOCK = -v /var/run/docker.sock:/var/run/docker.sock

TAG_NAME = ${DOCKER_IMG}
ifneq ($(DOCKER_USER), "")
TAG_NAME = ${DOCKER_USER}/${DOCKER_IMG}
endif

build:
# 	Build the container
	docker build --file ./Dockerfile --tag ${TAG_NAME}:linux-amd64-latest .
	docker build --file ./Dockerfile.arm --tag ${TAG_NAME}:linux-arm-latest .
.PHONY: build

download-docker:
	@echo "Downloading docker client with manifest command"
	wget https://6582-88013053-gh.circle-artifacts.com/1/work/build/docker-linux-amd64
	mv docker-linux-amd64 docker
	chmod +x docker
	./docker version
.PHONY: download-docker

install:
	npm install
	cd function && npm install
.PHONY: install

publish:
	./docker version || make download-docker
	$(eval VERSION := $(shell make version))

	docker tag ${TAG_NAME}:linux-amd64-latest ${TAG_NAME}:linux-amd64-${VERSION}
	docker tag ${TAG_NAME}:linux-arm-latest ${TAG_NAME}:linux-arm-${VERSION}

	docker push ${TAG_NAME}:linux-amd64-latest
	docker push ${TAG_NAME}:linux-amd64-${VERSION}
	docker push ${TAG_NAME}:linux-arm-latest
	docker push ${TAG_NAME}:linux-arm-${VERSION}

	./docker -D manifest create "${TAG_NAME}:${VERSION}" \
		"${TAG_NAME}:linux-amd64-${VERSION}" \
		"${TAG_NAME}:linux-arm-${VERSION}"
	./docker -D manifest annotate "${TAG_NAME}:${VERSION}" "${TAG_NAME}:linux-arm-${VERSION}" --os=linux --arch=arm --variant=v6
	./docker -D manifest push "${TAG_NAME}:${VERSION}"

	./docker -D manifest create "${TAG_NAME}:latest" \
		"${TAG_NAME}:linux-amd64-latest" \
		"${TAG_NAME}:linux-arm-latest"
	./docker -D manifest annotate "${TAG_NAME}:latest" "${TAG_NAME}:linux-arm-latest" --os=linux --arch=arm --variant=v6
	./docker -D manifest push "${TAG_NAME}:latest"
.PHONY: publish

test:
	cd function && npm test
.PHONY: test

version:
	@echo $(shell ./node_modules/.bin/json -f ./package.json -a version)
.PHONY: version
