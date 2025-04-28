package io.gatling.demo;

import java.time.Duration;
import java.util.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;
import io.gatling.javaapi.jdbc.*;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;
import static io.gatling.javaapi.jdbc.JdbcDsl.*;

public class GameSimulation extends Simulation {

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
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("If-None-Match", "W/\"e5-N1XK0j/7OBf1TQwhisP9SLjafcY\""),
    Map.entry("Origin", "http://localhost:3000")
  );
  
  private Map<CharSequence, String> headers_4 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("Origin", "http://localhost:3000")
  );
  
  private Map<CharSequence, String> headers_5 = Map.ofEntries(
    Map.entry("If-Modified-Since", "Mon, 28 Apr 2025 18:51:05 GMT"),
    Map.entry("If-None-Match", "W/\"de0-1967dbd1321\""),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_6 = Map.ofEntries(
    Map.entry("Access-Control-Request-Headers", "content-type"),
    Map.entry("Access-Control-Request-Method", "POST"),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_9 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("Content-Type", "application/json"),
    Map.entry("Origin", "http://localhost:3000")
  );
  
  private Map<CharSequence, String> headers_12 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("Content-Type", "application/json"),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=0")
  );
  
  private Map<CharSequence, String> headers_13 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"810-Azpyc0mOE2USqtMG+8GL606hrOE\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_14 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"775-UfXkIXHWJPm8JtVAFneAnrjm6mA\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_19 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"f70-qAXI/Ut8Or7BKrWRCy+3PgkCZPI\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_21 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"778-kt2ybmJHF3VMmKcYdLOznPOcaWA\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_23 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"f4d-2L5mdQvncJjvOV9yA+HnwJQy3dA\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_26 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"744-FhhpQxfQHP6uCV1xwDPYLFg+N/g\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_44 = Map.ofEntries(
    Map.entry("Accept", "application/font-woff2;q=1.0,application/font-woff;q=0.9,*/*;q=0.8"),
    Map.entry("Accept-Encoding", "identity"),
    Map.entry("If-None-Match", "W/\"a6e0-tNdIwyJTPN/PRTf+Ef3/465uhMs\"")
  );
  
  private String uri1 = "localhost";

  private ScenarioBuilder scn = scenario("GameSimulation")
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
            .get("/ranking")
            .headers(headers_3),
          http("request_4")
            .get("/ranking")
            .headers(headers_4),
          http("request_5")
            .get("http://" + uri1 + ":3000/resources/messages_es.properties")
            .headers(headers_5),
          http("request_6")
            .options("/getUserRole")
            .headers(headers_6),
          http("request_7")
            .get("http://" + uri1 + ":3000/resources/messages_es.properties")
            .headers(headers_5),
          http("request_8")
            .options("/getUserRole")
            .headers(headers_6),
          http("request_9")
            .post("/getUserRole")
            .headers(headers_9)
            .body(RawFileBody("io/gatling/demo/gamesimulation/0009_request.json")),
          http("request_10")
            .post("/getUserRole")
            .headers(headers_9)
            .body(RawFileBody("io/gatling/demo/gamesimulation/0010_request.json"))
        ),
      pause(5),
      http("request_11")
        .options("/start")
        .headers(headers_6)
        .resources(
          http("request_12")
            .post("/start")
            .headers(headers_12)
            .body(RawFileBody("io/gatling/demo/gamesimulation/0012_request.json")),
          http("request_13")
            .get("/question")
            .headers(headers_13),
          http("request_14")
            .get("/question")
            .headers(headers_14)
        ),
      pause(4),
      http("request_15")
        .options("/answer")
        .headers(headers_6)
        .resources(
          http("request_16")
            .post("/answer")
            .headers(headers_12)
            .body(RawFileBody("io/gatling/demo/gamesimulation/0016_request.json")),
          http("request_17")
            .get("/question")
            .headers(headers_14)
        ),
      pause(1),
      http("request_18")
        .post("/answer")
        .headers(headers_12)
        .body(RawFileBody("io/gatling/demo/gamesimulation/0018_request.json"))
        .resources(
          http("request_19")
            .get("/question")
            .headers(headers_19)
        ),
      pause(1),
      http("request_20")
        .post("/answer")
        .headers(headers_12)
        .body(RawFileBody("io/gatling/demo/gamesimulation/0020_request.json"))
        .resources(
          http("request_21")
            .get("/question")
            .headers(headers_21),
          http("request_22")
            .post("/answer")
            .headers(headers_12)
            .body(RawFileBody("io/gatling/demo/gamesimulation/0022_request.json")),
          http("request_23")
            .get("/question")
            .headers(headers_23),
          http("request_24")
            .options("/answer")
            .headers(headers_6),
          http("request_25")
            .post("/answer")
            .headers(headers_12)
            .body(RawFileBody("io/gatling/demo/gamesimulation/0025_request.json")),
          http("request_26")
            .get("/question")
            .headers(headers_26)
        ),
      pause(1),
      http("request_27")
        .options("/hintUsed")
        .headers(headers_6)
        .resources(
          http("request_28")
            .post("/hintUsed")
            .headers(headers_12)
            .body(RawFileBody("io/gatling/demo/gamesimulation/0028_request.json")),
          http("request_29")
            .options("/askllm")
            .headers(headers_6),
          http("request_30")
            .post("/askllm")
            .headers(headers_9)
            .body(RawFileBody("io/gatling/demo/gamesimulation/0030_request.json"))
        ),
      pause(5),
      http("request_31")
        .options("/askllm")
        .headers(headers_6)
        .resources(
          http("request_32")
            .post("/askllm")
            .headers(headers_12)
            .body(RawFileBody("io/gatling/demo/gamesimulation/0032_request.json")),
          http("request_33")
            .post("/chatBotUsed")
            .headers(headers_4)
        ),
      pause(1),
      http("request_34")
        .options("/hintUsed")
        .headers(headers_6)
        .resources(
          http("request_35")
            .post("/hintUsed")
            .headers(headers_12)
            .body(RawFileBody("io/gatling/demo/gamesimulation/0035_request.json")),
          http("request_36")
            .options("/askllm")
            .headers(headers_6),
          http("request_37")
            .post("/askllm")
            .headers(headers_9)
            .body(RawFileBody("io/gatling/demo/gamesimulation/0037_request.json"))
        ),
      pause(1),
      http("request_38")
        .options("/answer")
        .headers(headers_6)
        .resources(
          http("request_39")
            .post("/answer")
            .headers(headers_12)
            .body(RawFileBody("io/gatling/demo/gamesimulation/0039_request.json")),
          http("request_40")
            .options("/newHistory")
            .headers(headers_6),
          http("request_41")
            .options("/newRanking")
            .headers(headers_6),
          http("request_42")
            .options("/newRanking")
            .headers(headers_6),
          http("request_43")
            .options("/newHistory")
            .headers(headers_6),
          http("request_44")
            .get("http://" + uri1 + ":3000/static/media/great-vibes-latin-400-normal.d67b134b5da10fc907cf.woff2")
            .headers(headers_44),
          http("request_45")
            .post("/newRanking")
            .headers(headers_9)
            .body(RawFileBody("io/gatling/demo/gamesimulation/0045_request.json")),
          http("request_46")
            .post("/newHistory")
            .headers(headers_9)
            .body(RawFileBody("io/gatling/demo/gamesimulation/0046_request.json")),
          http("request_47")
            .post("/newRanking")
            .headers(headers_9)
            .body(RawFileBody("io/gatling/demo/gamesimulation/0047_request.json")),
          http("request_48")
            .post("/newHistory")
            .headers(headers_9)
            .body(RawFileBody("io/gatling/demo/gamesimulation/0048_request.json"))
        )
    );

  {
	setUp(scn.injectOpen(constantUsersPerSec(100).during(60).randomized()).protocols(httpProtocol));  
  }
}
