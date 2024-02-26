package edu.usc.csci310.project;

import static io.cucumber.junit.platform.engine.Constants.GLUE_PROPERTY_NAME;
import static io.cucumber.junit.platform.engine.Constants.PLUGIN_PROPERTY_NAME;
import static io.cucumber.junit.platform.engine.Constants.JUNIT_PLATFORM_NAMING_STRATEGY_PROPERTY_NAME;

import org.junit.platform.suite.api.*;

// this file should not be modified by student teams. add additional properties to the cucumber properties file
// to run a subset of the cucumber feature files, modify the cucumber.features property in the properties file

@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("edu/usc/csci310/project")
@ConfigurationParameter(key = GLUE_PROPERTY_NAME, value = "edu.usc.csci310.project")
@ConfigurationParameter(key = JUNIT_PLATFORM_NAMING_STRATEGY_PROPERTY_NAME, value = "long")
@ConfigurationParameter(key = PLUGIN_PROPERTY_NAME, value = "pretty, html:target/cucumber-reports/Cucumber.html, json:target/cucumber-reports/Cucumber.json, junit:target/cucumber-reports/Cucumber.xml")
public class CucumberIntegrationTest {}
