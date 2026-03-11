use std::time::Duration;
use std::{borrow::Cow, sync::LazyLock};

use jsonwebtoken::{
    Algorithm, DecodingKey, EncodingKey, Header, Validation, decode, encode, get_current_timestamp,
};

use super::result::ApiResult;
use serde::{Deserialize, Serialize};

static DEFAULT_JWT: LazyLock<JWT> = LazyLock::new(|| JWT::default());

const DEFAULT_SECRET: &str = "moyanxinxu";

#[derive(Debug, Clone)]
pub struct Principal {
    pub id: String,
    pub username: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    jti: String,
    sub: String,
    aud: String,
    iss: String,
    iat: u64,
    exp: u64,
}

#[derive(Debug, Deserialize)]
pub struct JwtConfig {
    pub secret: Cow<'static, str>,
    pub expiration: Duration,
    pub audience: String,
    pub issuer: String,
}

impl Default for JwtConfig {
    fn default() -> Self {
        Self {
            secret: Cow::Borrowed(DEFAULT_SECRET),
            expiration: Duration::from_secs(60 * 60),
            audience: "audience".to_string(),
            issuer: "issuer".to_string(),
        }
    }
}

pub struct JWT {
    encode_secret: EncodingKey,
    decode_secret: DecodingKey,
    header: Header,
    validation: Validation,
    expriation: Duration,
    audience: String,
    issuer: String,
}

impl JWT {
    pub fn new(config: JwtConfig) -> Self {
        let mut validation = Validation::new(Algorithm::HS256);

        validation.set_audience(&[&config.audience]);
        validation.set_issuer(&[&config.issuer]);
        validation.set_required_spec_claims(&["jti", "sub", "aud", "iss", "iat", "exp"]);

        let secret = config.secret.as_bytes();

        Self {
            encode_secret: EncodingKey::from_secret(secret),
            decode_secret: DecodingKey::from_secret(secret),
            header: Header::new(Algorithm::HS256),
            validation,
            expriation: config.expiration,
            audience: config.audience,
            issuer: config.issuer,
        }
    }

    pub fn encode(&self, principal: Principal) -> anyhow::Result<String> {
        let current_timestamp = get_current_timestamp();
        let claims = Claims {
            jti: xid::new().to_string(),
            sub: format!("{}:{}", principal.id, principal.username),
            aud: self.audience.clone(),
            iss: self.issuer.clone(),
            iat: current_timestamp,
            exp: current_timestamp.saturating_add(self.expriation.as_secs()),
        };

        Ok(encode(&self.header, &claims, &self.encode_secret)?)
    }

    pub fn decode(&self, token: &str) -> anyhow::Result<Principal> {
        let claims: Claims = decode(token, &self.decode_secret, &self.validation)?.claims;

        let mut parts = claims.sub.splitn(2, ':');

        let principla = Principal {
            id: parts.next().unwrap().to_string(),
            username: parts.next().unwrap().to_string(),
        };

        Ok(principla)
    }
}

impl Default for JWT {
    fn default() -> Self {
        Self::new(JwtConfig::default())
    }
}

pub fn get_jwt() -> &'static JWT {
    &DEFAULT_JWT
}

pub fn encode_password(password: &str) -> ApiResult<String> {
    let hash = bcrypt::hash(password, bcrypt::DEFAULT_COST)?;
    println!("bcrypt hash: {}", hash);
    Ok(hash)
}

pub fn verify_password(password: &str, hashed_password: &str) -> ApiResult<bool> {
    Ok(bcrypt::verify(password, hashed_password)?)
}
