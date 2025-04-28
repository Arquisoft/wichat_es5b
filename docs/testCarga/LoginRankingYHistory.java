package io.gatling.demo;

import java.time.Duration;
import java.util.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;
import io.gatling.javaapi.jdbc.*;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;
import static io.gatling.javaapi.jdbc.JdbcDsl.*;

public class LoginRankingYHistory extends Simulation {

  private HttpProtocolBuilder httpProtocol = http
    .baseUrl("http://localhost:8000")
    .inferHtmlResources()
    .acceptHeader("*/*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0");
  
  private Map<CharSequence, String> headers_0 = Map.ofEntries(
    Map.entry("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"),
    Map.entry("If-None-Match", "W/\"6dc-VG5WaWr+34wsm3D7adARrOJmU5k\""),
    Map.entry("Priority", "u=0, i"),
    Map.entry("Upgrade-Insecure-Requests", "1")
  );
  
  private Map<CharSequence, String> headers_1 = Map.of("If-None-Match", "W/\"37b33f-O4TlH521fVauDfQJCv0xAdjgpHs\"");
  
  private Map<CharSequence, String> headers_2 = Map.ofEntries(
    Map.entry("Accept", "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5"),
    Map.entry("If-Modified-Since", "Wed, 02 Apr 2025 14:08:25 GMT"),
    Map.entry("If-None-Match", "W/\"1b77b-195f6d4f049\""),
    Map.entry("Priority", "u=5")
  );
  
  private Map<CharSequence, String> headers_3 = Map.ofEntries(
    Map.entry("If-Modified-Since", "Mon, 28 Apr 2025 18:51:05 GMT"),
    Map.entry("If-None-Match", "W/\"de0-1967dbd1321\""),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_4 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("If-None-Match", "W/\"1c9-aBrNApzuHi2x5uqkRG6+zQUJopU\""),
    Map.entry("Origin", "http://localhost:3000")
  );
  
  private Map<CharSequence, String> headers_5 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("Origin", "http://localhost:3000")
  );
  
  private Map<CharSequence, String> headers_7 = Map.ofEntries(
    Map.entry("Access-Control-Request-Headers", "content-type"),
    Map.entry("Access-Control-Request-Method", "POST"),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_8 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("Content-Type", "application/json"),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=0")
  );
  
  private Map<CharSequence, String> headers_11 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("If-None-Match", "W/\"1c9-aBrNApzuHi2x5uqkRG6+zQUJopU\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=0")
  );
  
  private String uri1 = "localhost";

  private ScenarioBuilder scn = scenario("LoginRankingYHistory")
    .exec(
      http("request_0")
        .get("http://" + uri1 + ":3000/")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get("http://" + uri1 + ":3000/static/js/bundle.js")
            .headers(headers_1),
          http("request_2")
            .get("http://" + uri1 + ":3000/logo512.png")
            .headers(headers_2),
          http("request_3")
            .get("http://" + uri1 + ":3000/resources/messages_es.properties")
            .headers(headers_3),
          http("request_4")
            .get("/ranking")
            .headers(headers_4),
          http("request_5")
            .get("/ranking")
            .headers(headers_5),
          http("request_6")
            .get("http://" + uri1 + ":3000/resources/messages_es.properties")
            .headers(headers_3)
        ),
      pause(65),
      http("request_7")
        .options("/login")
        .headers(headers_7)
        .resources(
          http("request_8")
            .post("/login")
            .headers(headers_8)
            .body(RawFileBody("io/gatling/demo/loginrankingyhistory/0008_request.json"))
        ),
      pause(2),
      http("request_9")
        .options("/history")
        .headers(headers_7)
        .resources(
          http("request_10")
            .post("/history")
            .headers(headers_8)
            .body(RawFileBody("io/gatling/demo/loginrankingyhistory/0010_request.json"))
        ),
      pause(3),
      http("request_11")
        .get("/ranking")
        .headers(headers_11)
    );

  {
	  setUp(scn.injectOpen(atOnceUsers(100))).protocols(httpProtocol);
  }
}
