package testCarga;

import java.time.Duration;
import java.util.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;
import io.gatling.javaapi.jdbc.*;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;
import static io.gatling.javaapi.jdbc.JdbcDsl.*;

public class JugarPartida extends Simulation {

  private HttpProtocolBuilder httpProtocol = http
    .baseUrl("http://localhost:8000")
    .inferHtmlResources()
    .acceptHeader("*/*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0");
  
  private Map<CharSequence, String> headers_0 = Map.ofEntries(
    Map.entry("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"),
    Map.entry("If-None-Match", "\"c018a7b24f5f955c001f68aa44f9d9fd0c8f3599\""),
    Map.entry("Priority", "u=0, i"),
    Map.entry("Upgrade-Insecure-Requests", "1")
  );
  
  private Map<CharSequence, String> headers_1 = Map.of("If-None-Match", "\"972053b4029654a484bc5ad154760e01269e88a5\"");
  
  private Map<CharSequence, String> headers_2 = Map.ofEntries(
    Map.entry("Accept", "text/css,*/*;q=0.1"),
    Map.entry("If-None-Match", "\"b45cbe94a0b40584b9e5b8d5d0b9314ece99e7b5\""),
    Map.entry("Priority", "u=2")
  );
  
  private Map<CharSequence, String> headers_3 = Map.ofEntries(
    Map.entry("Accept", "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5"),
    Map.entry("If-None-Match", "\"fbda4fe604f42097ecc5b13fac494e04fb2ec586\""),
    Map.entry("Priority", "u=5")
  );
  
  private Map<CharSequence, String> headers_4 = Map.ofEntries(
    Map.entry("Access-Control-Request-Headers", "content-type"),
    Map.entry("Access-Control-Request-Method", "POST"),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_5 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("If-None-Match", "W/\"40c-QKj2GtcLU9sOo2LG16vFQCgTqls\""),
    Map.entry("Origin", "http://localhost:3000")
  );
  
  private Map<CharSequence, String> headers_6 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("Content-Type", "application/json"),
    Map.entry("Origin", "http://localhost:3000")
  );
  
  private Map<CharSequence, String> headers_8 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("Content-Type", "application/json"),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=0")
  );
  
  private Map<CharSequence, String> headers_9 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"1c6-cj8IoviRabzBiKhNTzW6jCv/MNI\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_12 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"856-QlyVZaMvsjNgiOJii4fVNCHICL0\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_14 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"452-7CjANgN/p5im24ggeTspJCbxQH4\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_16 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"17c-YRCTrXxFCQ9ZlLbhLPRiR5UEKHE\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_18 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"199-iVVk6PfGk5RUQfegz5PJamtmQy0\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_21 = Map.ofEntries(
    Map.entry("If-None-Match", "W/\"898-XKTxm3q/SzV3bimOnqK6gavaQBg\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_23 = Map.ofEntries(
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_26 = Map.ofEntries(
    Map.entry("Accept", "application/font-woff2;q=1.0,application/font-woff;q=0.9,*/*;q=0.8"),
    Map.entry("Accept-Encoding", "identity"),
    Map.entry("If-None-Match", "\"ec254f88ee8a4d2245a9d9fb160dcf99e3c14daf\"")
  );
  
  private String uri1 = "localhost";

  private ScenarioBuilder scn = scenario("JugarPartida")
    .exec(
      http("request_0")
        .get("http://" + uri1 + ":3000/")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get("http://" + uri1 + ":3000/static/js/main.478c3549.js")
            .headers(headers_1),
          http("request_2")
            .get("http://" + uri1 + ":3000/static/css/main.db58f7f6.css")
            .headers(headers_2),
          http("request_3")
            .get("http://" + uri1 + ":3000/logo512.png")
            .headers(headers_3),
          http("request_4")
            .options("/getUserRole")
            .headers(headers_4),
          http("request_5")
            .get("/ranking")
            .headers(headers_5),
          http("request_6")
            .post("/getUserRole")
            .headers(headers_6)
            .body(RawFileBody("testCarga/jugarpartida/0006_request.json"))
        ),
      pause(10),
      http("request_7")
        .options("/start")
        .headers(headers_4)
        .resources(
          http("request_8")
            .post("/start")
            .headers(headers_8)
            .body(RawFileBody("testCarga/jugarpartida/0008_request.json")),
          http("request_9")
            .get("/question")
            .headers(headers_9)
        ),
      pause(4),
      http("request_10")
        .options("/answer")
        .headers(headers_4)
        .resources(
          http("request_11")
            .post("/answer")
            .headers(headers_8)
            .body(RawFileBody("testCarga/jugarpartida/0011_request.json")),
          http("request_12")
            .get("/question")
            .headers(headers_12)
        ),
      pause(1),
      http("request_13")
        .post("/answer")
        .headers(headers_8)
        .body(RawFileBody("testCarga/jugarpartida/0013_request.json"))
        .resources(
          http("request_14")
            .get("/question")
            .headers(headers_14)
        ),
      pause(1),
      http("request_15")
        .post("/answer")
        .headers(headers_8)
        .body(RawFileBody("testCarga/jugarpartida/0015_request.json"))
        .resources(
          http("request_16")
            .get("/question")
            .headers(headers_16),
          http("request_17")
            .post("/answer")
            .headers(headers_8)
            .body(RawFileBody("testCarga/jugarpartida/0017_request.json")),
          http("request_18")
            .get("/question")
            .headers(headers_18),
          http("request_19")
            .options("/answer")
            .headers(headers_4),
          http("request_20")
            .post("/answer")
            .headers(headers_8)
            .body(RawFileBody("testCarga/jugarpartida/0020_request.json")),
          http("request_21")
            .get("/question")
            .headers(headers_21)
        ),
      pause(1),
      http("request_22")
        .post("/answer")
        .headers(headers_8)
        .body(RawFileBody("testCarga/jugarpartida/0022_request.json"))
        .resources(
          http("request_23")
            .post("/end")
            .headers(headers_23),
          http("request_24")
            .options("/newHistory")
            .headers(headers_4),
          http("request_25")
            .options("/newRanking")
            .headers(headers_4),
          http("request_26")
            .get("http://" + uri1 + ":3000/static/media/great-vibes-latin-400-normal.d67b134b5da10fc907cf.woff2")
            .headers(headers_26),
          http("request_27")
            .post("/newHistory")
            .headers(headers_6)
            .body(RawFileBody("testCarga/jugarpartida/0027_request.json")),
          http("request_28")
            .post("/newRanking")
            .headers(headers_6)
            .body(RawFileBody("testCarga/jugarpartida/0028_request.json"))
        )
    );

  {
	  setUp(scn.injectOpen(constantUsersPerSec(2).during(60).randomized()).protocols(httpProtocol));
  }
}
