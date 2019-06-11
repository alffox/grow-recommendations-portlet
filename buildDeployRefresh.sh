./gradlew clean deploy
cp ../bundles/osgi/modules/growrecommendationsportlet.jar ../liferay-dxp-7.1.10-ga1/deploy/
sleep 15s
xdotool search --onlyvisible --class Chrome windowfocus key ctrl+r