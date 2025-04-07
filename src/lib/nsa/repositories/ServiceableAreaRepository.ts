import { geoDb } from "@srms/server/db/postgres";
import { sql } from "drizzle-orm";
import { ServiceableArea } from "../types";
import { I_ServiceableAreaRepository } from "../interfaces";

export class ServiceableAreaRepository implements I_ServiceableAreaRepository {
  async getAllServiceableAreas(): Promise<ServiceableArea[]> {
    // Execute a SQL query to retrieve serviceable area data from the database
    // - Extracts `gid` (unique identifier), `purok`, and `barangay`.
    // - Converts the `geom` (geometry) column into GeoJSON format using `st_asgeojson(st_geomfromwkb(geom))`.
    // - Extracts the `coordinates` field from the resulting GeoJSON object as JSONB.
    const sqlStmt = await geoDb.execute(
      sql`SELECT 
    fid, 
    barangay, 
    jsonb_build_object(
        'type', (st_asgeojson(st_geomfromwkb(geom))::jsonb)->'type',
        'coordinates', (st_asgeojson(st_geomfromwkb(geom))::jsonb)->'coordinates'
    ) AS boundaries
FROM "BARANGAY";
`,
    );

    // Validate and parse the database response using Zod schema to ensure correct data structure
    // - Ensures the response adheres to the `ServiceableAreaSchema` structure.
    // - Uses `.array().parse()` to validate and parse multiple records into an array.
    //const res = ServiceableAreaSchema.array().parse(sqlStmt.rows);

    //throw new HTTPException(401, { message: "" });
    const res = sqlStmt.rows;
    return res;
  }
}

/* 

SELECT 
    sa.gid, 
    sa.purok, 
    sa.barangay, 
    jsonb_agg(jsonb_build_array((coord->>0)::numeric, (coord->>1)::numeric)) AS coordinates
FROM "SERVICEABLEAREA" sa
CROSS JOIN LATERAL jsonb_array_elements(
    (st_asgeojson(st_geomfromwkb(sa.geom))::jsonb -> 'coordinates')
) AS outer_array
CROSS JOIN LATERAL jsonb_array_elements(outer_array) AS inner_array
CROSS JOIN LATERAL jsonb_array_elements(inner_array) AS coord
GROUP BY sa.gid, sa.purok, sa.barangay;


SELECT gid, purok, barangay, (st_asgeojson(st_geomfromwkb(geom))::jsonb->'coordinates') AS coordinates
FROM "SERVICEABLEAREA";


  SERVICEABLE CONVER TO GEOJSON
  select gid, purok, barangay, st_asgeojson(st_geomfromwkb(geom))::jsonb from "SERVICEABLEAREA"

SELECT gid, purok, barangay, (st_asgeojson(st_geomfromwkb(geom))::jsonb->'coordinates') AS coordinates
FROM "SERVICEABLEAREA";

  172.20.110.85:2781:5432
  gensanwater.ictd@gmail.com 
  gensanwaterdistrict


  DB_HOST=172.20.110.85
  DB_PORT=5432
  DB_USER=srms_user
  DB_PASS=srms_password
  DB_NAME=srms




boundaries: {
  type: multip
  coordinates:


}




  */
