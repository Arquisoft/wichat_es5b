package testCarga;

import java.time.Duration;
import java.util.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;
import io.gatling.javaapi.jdbc.*;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;
import static io.gatling.javaapi.jdbc.JdbcDsl.*;

public class CreaciónDeUsuario extends Simulation {

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
    Map.entry("Priority", "u=4, i")
  );
  
  private Map<CharSequence, String> headers_4 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("If-None-Match", "W/\"40c-QKj2GtcLU9sOo2LG16vFQCgTqls\""),
    Map.entry("Origin", "http://localhost:3000")
  );
  
  private Map<CharSequence, String> headers_5 = Map.ofEntries(
    Map.entry("Access-Control-Request-Headers", "content-type"),
    Map.entry("Access-Control-Request-Method", "POST"),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_6 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("Content-Type", "application/json"),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=0")
  );
  
  private String uri1 = "localhost";

  private ScenarioBuilder scn = scenario("CreaciónDeUsuario")
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
            .get("/ranking")
            .headers(headers_4)
        ),
      pause(18),
      http("request_5")
        .options("/adduser")
        .headers(headers_5)
        .resources(
          http("request_6")
            .post("/adduser")
            .headers(headers_6)
            .body(RawFileBody("testCarga/creacióndeusuario/0006_request.json"))
        ),
      pause(25),
      http("request_7")
        .options("/login")
        .headers(headers_5)
        .resources(
          http("request_8")
            .post("/login")
            .headers(headers_6)
            .body(RawFileBody("testCarga/creacióndeusuario/0008_request.json"))
        )
    );

  {
	  setUp(scn.injectOpen(constantUsersPerSec(2).during(60).randomized()).protocols(httpProtocol));
  }
}
