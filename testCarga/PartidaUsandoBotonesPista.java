package testCarga;

import java.time.Duration;
import java.util.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;
import io.gatling.javaapi.jdbc.*;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;
import static io.gatling.javaapi.jdbc.JdbcDsl.*;

public class PartidaUsandoBotonesPista extends Simulation {

  private HttpProtocolBuilder httpProtocol = http
    .baseUrl("http://localhost:8000")
    .inferHtmlResources()
    .acceptHeader("application/json, text/plain, */*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0");
  
  private Map<CharSequence, String> headers_0 = Map.ofEntries(
    Map.entry("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"),
    Map.entry("If-None-Match", "\"c018a7b24f5f955c001f68aa44f9d9fd0c8f3599\""),
    Map.entry("Priority", "u=0, i"),
    Map.entry("Upgrade-Insecure-Requests", "1")
  );
  
  private Map<CharSequence, String> headers_1 = Map.ofEntries(
    Map.entry("Accept", "*/*"),
    Map.entry("If-None-Match", "\"972053b4029654a484bc5ad154760e01269e88a5\"")
  );
  
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
    Map.entry("If-None-Match", "W/\"40e-178OgiWTrjXV58Vms+ocVj9IZ/o\""),
    Map.entry("Origin", "http://localhost:3000")
  );
  
  private Map<CharSequence, String> headers_5 = Map.ofEntries(
    Map.entry("Accept", "*/*"),
    Map.entry("Access-Control-Request-Headers", "content-type"),
    Map.entry("Access-Control-Request-Method", "POST"),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_6 = Map.ofEntries(
    Map.entry("Content-Type", "application/json"),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=0")
  );
  
  private Map<CharSequence, String> headers_9 = Map.ofEntries(
    Map.entry("Accept", "*/*"),
    Map.entry("If-None-Match", "W/\"518-dc8EIVlThFu6lna3ipyO6CaDbBA\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_13 = Map.ofEntries(
    Map.entry("Content-Type", "application/json"),
    Map.entry("Origin", "http://localhost:3000")
  );
  
  private Map<CharSequence, String> headers_24 = Map.ofEntries(
    Map.entry("Accept", "*/*"),
    Map.entry("If-None-Match", "W/\"89a-qc61oiF0g4aCWKp1X05M/wCArXY\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_29 = Map.ofEntries(
    Map.entry("Accept", "*/*"),
    Map.entry("If-None-Match", "W/\"148-oArgFd2KUmSVlGPmpH8Aw/EedfQ\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_44 = Map.ofEntries(
    Map.entry("Accept", "*/*"),
    Map.entry("If-None-Match", "W/\"898-XKTxm3q/SzV3bimOnqK6gavaQBg\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_59 = Map.ofEntries(
    Map.entry("Accept", "*/*"),
    Map.entry("If-None-Match", "W/\"8d1-yvlPoLG65YRyjMR6rMSaFf5VPj8\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_72 = Map.ofEntries(
    Map.entry("Accept", "*/*"),
    Map.entry("If-None-Match", "W/\"8e7-54JX7dfFUWT0W5Ry8+J65zkt71w\""),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_77 = Map.ofEntries(
    Map.entry("Accept", "*/*"),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_80 = Map.ofEntries(
    Map.entry("Accept", "application/font-woff2;q=1.0,application/font-woff;q=0.9,*/*;q=0.8"),
    Map.entry("Accept-Encoding", "identity"),
    Map.entry("If-None-Match", "\"ec254f88ee8a4d2245a9d9fb160dcf99e3c14daf\"")
  );
  
  private String uri1 = "localhost";

  private ScenarioBuilder scn = scenario("PartidaUsandoBotonesPista")
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
      pause(17),
      http("request_5")
        .options("/login")
        .headers(headers_5)
        .resources(
          http("request_6")
            .post("/login")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0006_request.json"))
        ),
      pause(3),
      http("request_7")
        .options("/start")
        .headers(headers_5)
        .resources(
          http("request_8")
            .post("/start")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0008_request.json")),
          http("request_9")
            .get("/question")
            .headers(headers_9)
        ),
      pause(5),
      http("request_10")
        .options("/hintUsed")
        .headers(headers_5)
        .resources(
          http("request_11")
            .post("/hintUsed")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0011_request.json")),
          http("request_12")
            .options("/askllm")
            .headers(headers_5),
          http("request_13")
            .post("/askllm")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0013_request.json"))
        ),
      pause(3),
      http("request_14")
        .post("/hintUsed")
        .headers(headers_6)
        .body(RawFileBody("testCarga/partidausandobotonespista/0014_request.json"))
        .resources(
          http("request_15")
            .post("/askllm")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0015_request.json"))
        ),
      pause(5),
      http("request_16")
        .options("/hintUsed")
        .headers(headers_5)
        .resources(
          http("request_17")
            .post("/hintUsed")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0017_request.json")),
          http("request_18")
            .options("/askllm")
            .headers(headers_5),
          http("request_19")
            .post("/askllm")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0019_request.json"))
        ),
      pause(2),
      http("request_20")
        .post("/hintUsed")
        .headers(headers_6)
        .body(RawFileBody("testCarga/partidausandobotonespista/0020_request.json"))
        .resources(
          http("request_21")
            .post("/askllm")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0021_request.json"))
        ),
      pause(7),
      http("request_22")
        .options("/answer")
        .headers(headers_5)
        .resources(
          http("request_23")
            .post("/answer")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0023_request.json")),
          http("request_24")
            .get("/question")
            .headers(headers_24)
        ),
      pause(2),
      http("request_25")
        .options("/hintUsed")
        .headers(headers_5)
        .resources(
          http("request_26")
            .post("/hintUsed")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0026_request.json"))
        ),
      pause(4),
      http("request_27")
        .options("/answer")
        .headers(headers_5)
        .resources(
          http("request_28")
            .post("/answer")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0028_request.json")),
          http("request_29")
            .get("/question")
            .headers(headers_29),
          http("request_30")
            .options("/hintUsed")
            .headers(headers_5),
          http("request_31")
            .post("/hintUsed")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0031_request.json")),
          http("request_32")
            .options("/askllm")
            .headers(headers_5),
          http("request_33")
            .post("/askllm")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0033_request.json"))
        ),
      pause(1),
      http("request_34")
        .post("/hintUsed")
        .headers(headers_6)
        .body(RawFileBody("testCarga/partidausandobotonespista/0034_request.json"))
        .resources(
          http("request_35")
            .post("/askllm")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0035_request.json"))
        ),
      pause(2),
      http("request_36")
        .post("/hintUsed")
        .headers(headers_6)
        .body(RawFileBody("testCarga/partidausandobotonespista/0036_request.json"))
        .resources(
          http("request_37")
            .post("/askllm")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0037_request.json"))
        ),
      pause(2),
      http("request_38")
        .options("/hintUsed")
        .headers(headers_5)
        .resources(
          http("request_39")
            .post("/hintUsed")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0039_request.json")),
          http("request_40")
            .options("/askllm")
            .headers(headers_5),
          http("request_41")
            .post("/askllm")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0041_request.json"))
        ),
      pause(5),
      http("request_42")
        .options("/answer")
        .headers(headers_5)
        .resources(
          http("request_43")
            .post("/answer")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0043_request.json")),
          http("request_44")
            .get("/question")
            .headers(headers_44)
        ),
      pause(2),
      http("request_45")
        .options("/hintUsed")
        .headers(headers_5)
        .resources(
          http("request_46")
            .post("/hintUsed")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0046_request.json")),
          http("request_47")
            .options("/askllm")
            .headers(headers_5),
          http("request_48")
            .post("/askllm")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0048_request.json"))
        ),
      pause(1),
      http("request_49")
        .post("/hintUsed")
        .headers(headers_6)
        .body(RawFileBody("testCarga/partidausandobotonespista/0049_request.json"))
        .resources(
          http("request_50")
            .post("/askllm")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0050_request.json"))
        ),
      pause(2),
      http("request_51")
        .options("/hintUsed")
        .headers(headers_5)
        .resources(
          http("request_52")
            .post("/hintUsed")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0052_request.json")),
          http("request_53")
            .options("/askllm")
            .headers(headers_5),
          http("request_54")
            .post("/askllm")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0054_request.json"))
        ),
      pause(3),
      http("request_55")
        .post("/hintUsed")
        .headers(headers_6)
        .body(RawFileBody("testCarga/partidausandobotonespista/0055_request.json"))
        .resources(
          http("request_56")
            .post("/askllm")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0056_request.json"))
        ),
      pause(5),
      http("request_57")
        .options("/answer")
        .headers(headers_5)
        .resources(
          http("request_58")
            .post("/answer")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0058_request.json")),
          http("request_59")
            .get("/question")
            .headers(headers_59)
        ),
      pause(2),
      http("request_60")
        .options("/hintUsed")
        .headers(headers_5)
        .resources(
          http("request_61")
            .post("/hintUsed")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0061_request.json")),
          http("request_62")
            .options("/askllm")
            .headers(headers_5),
          http("request_63")
            .post("/askllm")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0063_request.json")),
          http("request_64")
            .post("/hintUsed")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0064_request.json")),
          http("request_65")
            .post("/askllm")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0065_request.json"))
        ),
      pause(1),
      http("request_66")
        .post("/hintUsed")
        .headers(headers_6)
        .body(RawFileBody("testCarga/partidausandobotonespista/0066_request.json"))
        .resources(
          http("request_67")
            .post("/askllm")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0067_request.json")),
          http("request_68")
            .post("/hintUsed")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0068_request.json")),
          http("request_69")
            .post("/askllm")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0069_request.json"))
        ),
      pause(3),
      http("request_70")
        .options("/answer")
        .headers(headers_5)
        .resources(
          http("request_71")
            .post("/answer")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0071_request.json")),
          http("request_72")
            .get("/question")
            .headers(headers_72),
          http("request_73")
            .options("/hintUsed")
            .headers(headers_5),
          http("request_74")
            .post("/hintUsed")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0074_request.json"))
        ),
      pause(3),
      http("request_75")
        .options("/answer")
        .headers(headers_5)
        .resources(
          http("request_76")
            .post("/answer")
            .headers(headers_6)
            .body(RawFileBody("testCarga/partidausandobotonespista/0076_request.json")),
          http("request_77")
            .post("/end")
            .headers(headers_77),
          http("request_78")
            .options("/newHistory")
            .headers(headers_5),
          http("request_79")
            .options("/newRanking")
            .headers(headers_5),
          http("request_80")
            .get("http://" + uri1 + ":3000/static/media/great-vibes-latin-400-normal.d67b134b5da10fc907cf.woff2")
            .headers(headers_80),
          http("request_81")
            .post("/newHistory")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0081_request.json")),
          http("request_82")
            .post("/newRanking")
            .headers(headers_13)
            .body(RawFileBody("testCarga/partidausandobotonespista/0082_request.json"))
        )
    );

  {
	  setUp(scn.injectOpen(constantUsersPerSec(2).during(60).randomized()).protocols(httpProtocol));
  }
}
