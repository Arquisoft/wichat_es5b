package testCarga;

import java.time.Duration;
import java.util.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;
import io.gatling.javaapi.jdbc.*;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;
import static io.gatling.javaapi.jdbc.JdbcDsl.*;

public class AccesoAGrafanaYPrometheus extends Simulation {

  private HttpProtocolBuilder httpProtocol = http
    .baseUrl("http://localhost:3000")
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
    Map.entry("Access-Control-Request-Headers", "content-type"),
    Map.entry("Access-Control-Request-Method", "POST"),
    Map.entry("Origin", "http://localhost:3000"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_5 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("If-None-Match", "W/\"3fd-6lnvvPBSQFM2oLYB+hZMj90sJhA\""),
    Map.entry("Origin", "http://localhost:3000")
  );
  
  private Map<CharSequence, String> headers_6 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("Content-Type", "application/json"),
    Map.entry("Origin", "http://localhost:3000")
  );
  
  private Map<CharSequence, String> headers_7 = Map.ofEntries(
    Map.entry("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"),
    Map.entry("Priority", "u=0, i"),
    Map.entry("Upgrade-Insecure-Requests", "1")
  );
  
  private Map<CharSequence, String> headers_8 = Map.ofEntries(
    Map.entry("Accept", "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5"),
    Map.entry("Priority", "u=4, i")
  );
  
  private Map<CharSequence, String> headers_9 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("Priority", "u=4"),
    Map.entry("x-grafana-org-id", "1")
  );
  
  private Map<CharSequence, String> headers_11 = Map.ofEntries(
    Map.entry("Accept", "application/font-woff2;q=1.0,application/font-woff;q=0.9,*/*;q=0.8"),
    Map.entry("Accept-Encoding", "identity"),
    Map.entry("If-Modified-Since", "Fri, 21 Mar 2025 13:56:09 GMT")
  );
  
  private Map<CharSequence, String> headers_12 = Map.of("If-Modified-Since", "Wed, 23 Apr 2025 11:03:21 GMT");
  
  private Map<CharSequence, String> headers_13 = Map.of("If-Modified-Since", "Wed, 23 Apr 2025 11:03:20 GMT");
  
  private Map<CharSequence, String> headers_14 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("Priority", "u=4"),
    Map.entry("x-grafana-device-id", "59027fc8367f32a5b0f8f8be6f798bfb"),
    Map.entry("x-grafana-org-id", "1")
  );
  
  private Map<CharSequence, String> headers_16 = Map.ofEntries(
    Map.entry("If-Modified-Since", "Fri, 21 Mar 2025 13:56:09 GMT"),
    Map.entry("Priority", "u=4")
  );
  
  private Map<CharSequence, String> headers_44 = Map.ofEntries(
    Map.entry("Cache-Control", "no-cache"),
    Map.entry("Pragma", "no-cache"),
    Map.entry("Priority", "u=4")
  );
  
  private String uri1 = "localhost";

  private ScenarioBuilder scn = scenario("AccesoAGrafanaYPrometheus")
    .exec(
      http("request_0")
        .get("/")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get("/static/js/main.478c3549.js")
            .headers(headers_1),
          http("request_2")
            .get("/static/css/main.db58f7f6.css")
            .headers(headers_2),
          http("request_3")
            .get("/logo512.png")
            .headers(headers_3),
          http("request_4")
            .options("http://" + uri1 + ":8000/getUserRole")
            .headers(headers_4),
          http("request_5")
            .get("http://" + uri1 + ":8000/ranking")
            .headers(headers_5),
          http("request_6")
            .post("http://" + uri1 + ":8000/getUserRole")
            .headers(headers_6)
            .body(RawFileBody("testCarga/accesoagrafanayprometheus/0006_request.json"))
        ),
      pause(6),
      http("request_7")
        .get("http://" + uri1 + ":9091/")
        .headers(headers_7)
        .resources(
          http("request_8")
            .get("http://" + uri1 + ":9091/public/img/grafana_icon.svg")
            .headers(headers_8),
          http("request_9")
            .get("http://" + uri1 + ":9091/api/plugins/grafana-lokiexplore-app/settings")
            .headers(headers_9),
          http("request_10")
            .get("http://" + uri1 + ":9091/api/plugins/grafana-pyroscope-app/settings")
            .headers(headers_9),
          http("request_11")
            .get("http://" + uri1 + ":9091/public/fonts/inter/Inter-Regular.woff2")
            .headers(headers_11),
          http("request_12")
            .get("http://" + uri1 + ":9091/public/plugins/grafana-lokiexplore-app/module.js?_cache=1.0.12")
            .headers(headers_12),
          http("request_13")
            .get("http://" + uri1 + ":9091/public/plugins/grafana-pyroscope-app/module.js?_cache=1.3.0")
            .headers(headers_13),
          http("request_14")
            .get("http://" + uri1 + ":9091/api/dashboards/home")
            .headers(headers_14),
          http("request_15")
            .get("http://" + uri1 + ":9091/public/fonts/inter/Inter-Medium.woff2")
            .headers(headers_11),
          http("request_16")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/times.svg")
            .headers(headers_16),
          http("request_17")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/star.svg")
            .headers(headers_16),
          http("request_18")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/rocket.svg")
            .headers(headers_16),
          http("request_19")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/compass.svg")
            .headers(headers_16),
          http("request_20")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/angle-down.svg")
            .headers(headers_16),
          http("request_21")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/apps.svg")
            .headers(headers_16),
          http("request_22")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/bell.svg")
            .headers(headers_16),
          http("request_23")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/adjust-circle.svg")
            .headers(headers_16),
          http("request_24")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/web-section-alt.svg")
            .headers(headers_16),
          http("request_25")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/home-alt.svg")
            .headers(headers_16),
          http("request_26")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/angle-right.svg")
            .headers(headers_16),
          http("request_27")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/plus.svg")
            .headers(headers_16),
          http("request_28")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/drilldown.svg")
            .headers(headers_16),
          http("request_29")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/search.svg")
            .headers(headers_16),
          http("request_30")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/monitor.svg")
            .headers(headers_16),
          http("request_31")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/cog.svg")
            .headers(headers_16),
          http("request_32")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/question-circle.svg")
            .headers(headers_16),
          http("request_33")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/keyboard.svg")
            .headers(headers_16),
          http("request_34")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/spinner.svg")
            .headers(headers_16),
          http("request_35")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/ellipsis-v.svg")
            .headers(headers_16),
          http("request_36")
            .get("http://" + uri1 + ":9091/api/prometheus/grafana/api/v1/rules?dashboard_uid=null")
            .headers(headers_14),
          http("request_37")
            .get("http://" + uri1 + ":9091/api/plugins?embedded=0&core=0")
            .headers(headers_14),
          http("request_38")
            .get("http://" + uri1 + ":9091/api/search?limit=30&starred=true")
            .headers(headers_14),
          http("request_39")
            .get("http://" + uri1 + ":9091/api/search?limit=1")
            .headers(headers_14),
          http("request_40")
            .get("http://" + uri1 + ":9091/api/search?limit=30")
            .headers(headers_14),
          http("request_41")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/exclamation-circle.svg")
            .headers(headers_16),
          http("request_42")
            .get("http://" + uri1 + ":9091/public/img/icons/unicons/external-link-alt.svg")
            .headers(headers_16)
        ),
      pause(3),
      http("request_43")
        .get("http://" + uri1 + ":9090/")
        .headers(headers_7)
        .resources(
          http("request_44")
            .get("http://" + uri1 + ":9090/-/ready")
            .headers(headers_44),
          http("request_45")
            .get("http://" + uri1 + ":9090/api/v1/label/__name__/values")
            .headers(headers_44),
          http("request_46")
            .get("http://" + uri1 + ":9090/api/v1/query?query=time()")
            .headers(headers_44)
        )
    );

  {
	  setUp(scn.injectOpen(constantUsersPerSec(2).during(60).randomized()).protocols(httpProtocol));
  }
}
