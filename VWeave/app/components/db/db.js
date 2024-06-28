import { Pool } from 'pg'
import { v4 as uuidv4 } from 'uuid';

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

let pool = undefined

async function query(q, params) {
  if (pool === undefined) {
    console.log('Creating new db pool')
    pool = new Pool({ connectionString })
    await pool.connect()
  }
  const result = await pool.query(q, params || [])
  return result
}


export const DB = {
  getOrgByUUID: async (orgUUID) => {
    return (await query(`SELECT * from profile.organizations where uuid = '${orgUUID}';`)).rows
  },

  getOrgCPCodes: async (orgUUID) => {
    return (await query(`SELECT cp_codes from cdn.akamai_org_configs where organization_uuid = '${orgUUID}';`)).rows
  },

  getActiveNonRegularStreams: async () => {
    return (await query(`select stream_key, playback_url, image_url from video.livestreams l join video.livestream_thumbnails lt on lt.livestream_id = l.id 	where status_id =4 and category in ('Custom', 'SSAI') and image_url like concat('%',stream_key,'%');`)).rows
  },
  createProfileByUUID: async ({
    name,
    uuid,
    config,
    is_for_vod,
    is_for_live,
    status
  }) => {
    const time = new Date();
    const created_on = time;
    const created_by = "ADMIN";
    const updated_on = time;
    const updated_by = "ADMIN";

    const result = await query(
      `
          INSERT INTO profile.ENCODING_PROFILES (UUID, NAME, CONFIG, IS_FOR_VOD, IS_FOR_LIVE, STATUS, CREATED_ON, CREATED_BY, UPDATED_ON, UPDATED_BY)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *;
        `,
      [uuid, name, config, is_for_vod, is_for_live, status, created_on, created_by, updated_on, updated_by]
    );

    return result.rows;
  },

  createEncodingProfileOrgMapping: async ({
    profileId,
    contentType,
    status
  }) => {
    const time = new Date();
    const createdOn = time;
    const updatedOn = time;
    const createdBy = 'ADMIN'
    const updatedBy = 'ADMIN'
    const defaultOrgUUID = '';

    const result = await query(
      `
            INSERT INTO profile.ENCODING_PROFILE_ORG_MAPPINGS (
              PROFILE_ID,
              org_id,
              CONTENT_TYPE,
              STATUS,
              CREATED_ON,
              CREATED_BY,
              UPDATED_ON,
              UPDATED_BY
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
          `,
      [profileId, await DB.orgId(defaultOrgUUID), contentType, status, createdOn, createdBy, updatedOn, updatedBy]
    );

    return result.rows;
  },


  // listAllProfiles: async () => {
  //   const result = await query(`
  //     SELECT 
  //     encoding_profiles.uuid,
  //     encoding_profiles.name,
  //     encoding_profiles.config,
  //     encoding_profiles.is_for_vod,
  //     encoding_profiles.is_for_live,
  //     encoding_profiles.created_on,
  //     encoding_profiles.created_by
  //     FROM admin.ENCODING_PROFILES;
  //   `);
  //   const mappedResults = result.rows.map(row => ({
  //     uuid: row.uuid,
  //     name: row.name,
  //     config: JSON.parse(row.config),
  //     is_for_vod: row.is_for_vod,
  //     is_for_live: row.is_for_live,
  //     created_on: Date.parse(row.created_on),
  //     created_by: row.created_by
  //   }));

  //   return mappedResults;
  // },

  listAllProfilesNonDeleted: async () => {
    const result = await query(`select * from profile.encoding_profiles where status != 'Inactive' ORDER BY created_on DESC`)
    return result.rows
  },

  listOrgProfiles: async (orgUUID) => {
    const result = await query(`select * from profile.encoding_profile_org_mappings where org_id in ( select id from profile.organizations where uuid = '${orgUUID}') ORDER BY created_on DESC`)
    return result.rows
  },

  orgId: async (orgUUID) => (await query(`select * from profile.organizations where uuid = '${orgUUID}'`)).rows[0].id,

  createOrgProfileMapping: async (profileId, orgUUID, contentType, uuid) => {
    const created_by = "ADMIN";
    const updated_by = "ADMIN";

    const result = await query(`
          INSERT INTO profile.encoding_profile_org_mappings (profile_id, org_id, content_type, status, created_by, updated_by, uuid)
          VALUES ($1, $2, $3, 'Available', $4, $5, $6)`,
      [profileId, await DB.orgId(orgUUID), contentType, created_by, updated_by, uuid]
    );
    return result.rows;
  },



  deleteOrgProfileMapping: async (profileId, orgUUID, contentType) => {
    const result = await query(`
    DELETE FROM profile.encoding_profile_org_mappings
    WHERE profile_id = $1
    AND org_id = $2
    AND content_type = $3`,
      [profileId, await DB.orgId(orgUUID), contentType]
    );
    return result.rows
  },

  listAllProfiles: async () => {
    const result = await query(`
    SELECT 
    encoding_profiles.uuid,
    encoding_profiles.name,
    encoding_profiles.config,
    encoding_profiles.is_for_vod,
    encoding_profiles.is_for_live,
    encoding_profiles.status,
    encoding_profiles.created_on,
    encoding_profiles.created_by,
    COUNT(DISTINCT CASE WHEN ENCODING_PROFILE_ORG_MAPPINGS.status = 'Selected' THEN ENCODING_PROFILE_ORG_MAPPINGS.org_id END) AS selected_org_count,
    COUNT(DISTINCT CASE WHEN ENCODING_PROFILE_ORG_MAPPINGS.status = 'Available' THEN ENCODING_PROFILE_ORG_MAPPINGS.org_id END) AS available_org_count
    FROM 
        profile.ENCODING_PROFILES AS encoding_profiles
    LEFT JOIN 
        profile.ENCODING_PROFILE_ORG_MAPPINGS AS ENCODING_PROFILE_ORG_MAPPINGS 
        ON encoding_profiles.id = ENCODING_PROFILE_ORG_MAPPINGS.profile_id
    GROUP BY 
        encoding_profiles.uuid, 
        encoding_profiles.name, 
        encoding_profiles.config, 
        encoding_profiles.is_for_vod, 
        encoding_profiles.is_for_live, 
        encoding_profiles.status,
        encoding_profiles.created_on, 
        encoding_profiles.created_by
    ORDER BY 
        encoding_profiles.created_on DESC;
    `);
    const mappedResults = result.rows.map(row => ({
      uuid: row.uuid,
      name: row.name,
      config: JSON.parse(row.config),
      is_for_vod: row.is_for_vod,
      is_for_live: row.is_for_live,
      status: row.status,
      created_on: Date.parse(row.created_on),
      created_by: row.created_by,
      selected_org_count: parseInt(row.selected_org_count),
      available_org_count: parseInt(row.available_org_count)
    }));

    return mappedResults;
  },



  listProfilesForOrganization: async () => {
    const result = await query(`
      SELECT 
      ep.name,
      ep.uuid,
      ep.config,
      ep.is_for_vod,
      ep.is_for_live,
      ep.created_on,
      ep.created_by,
      eopm.status 
      FROM profile.ENCODING_PROFILES AS ep
      LEFT JOIN profile.ENCODING_PROFILE_ORG_MAPPINGS AS eopm ON ep.ID = eopm.PROFILE_ID
      ORDER BY 
          ep.created_on DESC;
      `, []);
    const mappedResults = result.rows.map(row => ({
      name: row.name,
      uuid: row.uuid,
      config: JSON.parse(row.config),
      is_for_vod: row.is_for_vod,
      is_for_live: row.is_for_live,
      created_on: Date.parse(row.created_on),
      created_by: row.created_by,
      status: row.status
    }));

    return mappedResults;
  },

  updateStatusForOrganization: async (profileUUID, orgUUID, newStatus) => {
    const result = await query(`
      UPDATE profile.ENCODING_PROFILE_ORG_MAPPINGS AS eopm
      SET status = $1
      WHERE eopm.PROFILE_ID = (SELECT ID FROM profile.ENCODING_PROFILES WHERE uuid = $2)
      AND eopm.org_id = $3;
    `, [profileUUID, await DB.orgId(orgUUID), newStatus]);
    return result.rows[0];
  },

  updateProfileByUUID: async (profileUUID, updatedData) => {
    const { name, config, is_for_vod, is_for_live } = updatedData;
    const result = await query(`
        UPDATE profile.ENCODING_PROFILES
        SET NAME = $1, CONFIG = $2, IS_FOR_VOD = $3, IS_FOR_LIVE = $4
        WHERE UUID = $5
        RETURNING *;
      `, [name, config, is_for_vod, is_for_live, profileUUID]);
    return result.rows[0];
  },

  deleteProfileByUUID: async (profileUUID) => {
    const result = await query(
      `
        UPDATE profile.ENCODING_PROFILES
        SET STATUS = 'Inactive'
        WHERE UUID = $1
        RETURNING *;
        `,
      [profileUUID]
    );
    return result.rows[0];
  },

  listOrganizationsForProfile: async (profileID) => {
    const result = await query(
      `
        SELECT 
          o.uuid as org_uuid,
          o.name,
          content_type,
          config,
          encoding_profile_org_mappings.created_on,
          encoding_profile_org_mappings.created_by
          FROM 
        profile.encoding_profiles
        JOIN profile.encoding_profile_org_mappings ON encoding_profiles.id = encoding_profile_org_mappings.profile_id
        JOIN profile.organizations o ON o.id = encoding_profile_org_mappings.org_id 
        WHERE PROFILE_ID = $1
        ORDER BY 
          encoding_profile_org_mappings.created_on DESC;
        `,
      [profileID]
    );

    const mappedResults = result.rows.map(row => ({
      org_uuid: row.org_uuid,
      org_name: row.name,
      content_type: row.content_type,
      config: JSON.parse(row.config),
      created_on: Date.parse(row.created_on),
      created_by: row.created_by,
      status: 'Available'
    }));

    return mappedResults;
  },


  getProfileByUUID: async (profileUUID) => {
    const result = await query(
      `
        SELECT *
        FROM profile.ENCODING_PROFILES
        WHERE UUID = $1;
        `,
      [profileUUID]
    );
    const rows = result.rows
    return rows.length > 0 ? rows[0] : undefined
  },

  getProfileByName: async (profileName) => {
    const result = await query(
      `
        SELECT *
        FROM profile.ENCODING_PROFILES
        WHERE NAME = $1;
        `,
      [profileName]
    );
    return result.rows[0];
  },

  getProfileDetailsByUUID: async (profileUUID) => {
    const result = await query(`
        SELECT 
        encoding_profiles.uuid,
        encoding_profiles.name,
        encoding_profiles.config,
        encoding_profiles.is_for_vod,
        encoding_profiles.is_for_live,
        encoding_profiles.status,
        encoding_profiles.created_on,
        encoding_profiles.created_by,
        COUNT(DISTINCT CASE WHEN ENCODING_PROFILE_ORG_MAPPINGS.status = 'Selected' THEN ENCODING_PROFILE_ORG_MAPPINGS.org_id END) AS selected_org_count,
        COUNT(DISTINCT CASE WHEN ENCODING_PROFILE_ORG_MAPPINGS.status = 'Available' THEN ENCODING_PROFILE_ORG_MAPPINGS.org_id END) AS available_org_count
        FROM profile.ENCODING_PROFILES as encoding_profiles
        LEFT JOIN 
          profile.ENCODING_PROFILE_ORG_MAPPINGS AS ENCODING_PROFILE_ORG_MAPPINGS 
          ON encoding_profiles.id = ENCODING_PROFILE_ORG_MAPPINGS.profile_id
        WHERE encoding_profiles.UUID = $1
        GROUP BY 
        encoding_profiles.uuid,
        encoding_profiles.name,
        encoding_profiles.config,
        encoding_profiles.is_for_vod,
        encoding_profiles.is_for_live,
        encoding_profiles.status,
        encoding_profiles.created_on,
        encoding_profiles.created_by;
      `, [profileUUID]);
    const mappedResults = result.rows.map(row => ({
      uuid: row.uuid,
      name: row.name,
      config: JSON.parse(row.config),
      is_for_vod: row.is_for_vod,
      is_for_live: row.is_for_live,
      status: row.status,
      selected_org_count: parseInt(row.selected_org_count),
      available_org_count: parseInt(row.available_org_count),
      created_on: Date.parse(row.created_on),
      created_by: row.created_by
    }));

    return mappedResults;
  },

  getLiveStreamDistributionByOrigin: async (origin) => {
    const result = await query(`SELECT provider,origin,distribution_domain FROM cdn.livestream_provider_origin_distributions WHERE origin = $1;`, [origin]);
    const rows = result.rows
    return rows.length > 0 ? rows[0] : undefined
  },

  createLiveStreamDistribution: async (provider, origin, distribution_id, distribution_domain, status, created_by) => {
    const result = await query(
      `
        INSERT INTO cdn.livestream_provider_origin_distributions (uuid,provider,origin,distribution_id,distribution_domain,status,created_by,updated_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `,
      [uuidv4(), provider, origin, distribution_id, distribution_domain, status, created_by, created_by]
    );
    return result.rows;
  },

  getPendingActivationOrgAkamaiDomainConfig: async () =>
    (await query(`select distinct akamai_property_id from cdn.org_akamai_domain_configs where is_activation_pending = true`)).rows,

  markPropertyAsActivationInitiated: async (propertyId) => {
    (await query(`update cdn.org_akamai_domain_configs set is_activation_pending = false where is_activation_pending = true and akamai_property_id = $1`, [propertyId]))
  },

  markPropertyAsActivationPending: async (propertyId) => {
    (await query(`update cdn.org_akamai_domain_configs set is_activation_pending = true where is_activation_pending = false and akamai_property_id = $1`, [propertyId]))
  },

  createOrgCustomDomain: async(orgUUID, domain, akamai_cpcode, akamai_datastream_id) => 
    (await query(`insert into cdn.org_custom_domains (uuid, org_uuid, domain, akamai_cp_code,akamai_data_stream_id, created_by, updated_by) values ($1,$2,$3,$4,$5,$6,$7) returning *;`,
      [uuidv4(), orgUUID, domain, akamai_cpcode, akamai_datastream_id, 'Videograph Admin', 'Videograph Admin'])).rows[0],
  listOrgCustomDomainsForOrg: async(orgUUID) => (await query(`select * from cdn.org_custom_domains where org_uuid = $1`, [orgUUID])).rows,
  listOrgCustomDomainsByStatus: async(stage, status) => (await query(`select * from cdn.org_custom_domains where stage = $1 and status = $2`, [stage, status])).rows,
  listNonActiveOrgCustomDomains: async() => (await query(`select * from cdn.org_custom_domains where status != $1`, ['Active'])).rows,
  getOrgCustomDomainByUUID: async(uuid) => (await query(`select * from cdn.org_custom_domains where uuid = $1`, [uuid])).rows[0],
  updateOrgCustomDomainStatus: async(uuid, stage, status, data_log) => 
    (await query(`update cdn.org_custom_domains set stage= $1, status = $2, data_log = $3, updated_on = now(), updated_by ='Videograph Admin' where uuid = $4 returning *;`, [stage, status, data_log || '', uuid])).rows[0],
  updateOrgCustomDomainCpCode: async(uuid, akamai_cpcode, stage, status, data_log) => 
    (await query(`update cdn.org_custom_domains set stage= $1, status = $2, data_log = $3, akamai_cp_code = $4, updated_on = now(), updated_by ='Videograph Admin' where uuid = $5 returning *;`, [stage, status, data_log || '', akamai_cpcode, uuid])).rows[0],
  updateOrgCustomDomainProperty: async(uuid, akamai_property_id, amamai_property_version_id, stage, status, data_log) => 
    (await query(`update cdn.org_custom_domains set stage= $1, status = $2, data_log = $3, akamai_property_id = $4, akamai_property_version = $5, updated_on = now(), updated_by ='Videograph Admin' where uuid = $6 returning *;`, [stage, status, data_log || '', akamai_property_id, amamai_property_version_id, uuid])).rows[0],

  createNewDefaultOrgDomainConfig: async(orgUUID, akamaiGroupId, akamaiContractId, akamaiPropertyId, akamaiPropertyName, akamaiDomain, cpcodes) => {
    await query(`update cdn.org_akamai_domain_configs set is_default= false, updated_on = now(), updated_by ='Videograph Admin' where org_uuid = $1 returning *;`, [orgUUID])
    return (await query(`insert into cdn.org_akamai_domain_configs (uuid, org_uuid, akamai_group_id, akamai_contract_id, akamai_property_id, akamai_property_name, akamai_domain,cpcodes, created_by, updated_by) values ($1,$2,$3,$4,$5,$6,$7) returning *;`,
      [uuidv4(), orgUUID, akamaiGroupId, akamaiContractId, akamaiPropertyId, akamaiPropertyName, akamaiDomain, cpcodes, 'Videograph Admin', 'Videograph Admin'])).rows[0]
  }
}