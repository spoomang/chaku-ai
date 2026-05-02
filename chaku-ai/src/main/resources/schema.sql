-- USER
CREATE TABLE IF NOT EXISTS "user" (
    id          SERIAL PRIMARY KEY,
    member_id   UUID UNIQUE,
    name        VARCHAR(255) NOT NULL,
    short_name  VARCHAR(100) NOT NULL,
    email       VARCHAR(200),
    mobile      VARCHAR(20)  NOT NULL UNIQUE,
    status      VARCHAR(30)  NOT NULL,
    password    VARCHAR(50)  NOT NULL DEFAULT 'password1',
    create_time TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  UUID,
    update_time TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by  UUID,
    delete_time TIMESTAMP
);

-- GROUP
CREATE TABLE IF NOT EXISTS "group" (
    id          SERIAL PRIMARY KEY,
    group_id    UUID UNIQUE,
    name        VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    size        SMALLINT,
    create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  UUID,
    update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by  UUID
);

-- GROUP MEMBER
CREATE TABLE IF NOT EXISTS group_member (
    id          SERIAL PRIMARY KEY,
    group_id    UUID        NOT NULL,
    member_id   UUID        NOT NULL,
    status      VARCHAR(10) NOT NULL,
    is_admin    BOOL        DEFAULT false,
    create_time TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  UUID,
    update_time TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by  UUID,
    delete_time TIMESTAMP,
    CONSTRAINT uniq_member_group UNIQUE (group_id, member_id)
);

CREATE INDEX IF NOT EXISTS group_member_ids ON group_member (group_id, member_id);

-- VENUE
CREATE TABLE IF NOT EXISTS venue (
    id           UUID PRIMARY KEY,
    name         VARCHAR(400),
    address      VARCHAR(1000),
    latitude     DECIMAL,
    longitude    DECIMAL,
    opening_time VARCHAR(255),
    closing_time VARCHAR(255),
    rating       INT,
    create_time  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by   UUID,
    update_time  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by   UUID,
    delete_time  TIMESTAMP
);

-- EVENT
CREATE TABLE IF NOT EXISTS event (
    id                 SERIAL PRIMARY KEY,
    event_id           UUID         UNIQUE,
    group_id           UUID         NOT NULL,
    venue_id           UUID,
    name               VARCHAR(500) NOT NULL,
    type               VARCHAR(50)  NOT NULL,
    status             VARCHAR(20)  NOT NULL,
    params             TEXT,
    description        VARCHAR(1000),
    no_of_participants INT,
    total_cost         INT,
    currency           VARCHAR(10),
    start_date_time    TIMESTAMP,
    end_date_time      TIMESTAMP,
    create_time        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by         UUID,
    update_time        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by         UUID,
    delete_time        TIMESTAMP
);

-- EVENT MEMBER
CREATE TABLE IF NOT EXISTS event_member (
    id          SERIAL PRIMARY KEY,
    event_id    UUID        NOT NULL,
    group_id    UUID        NOT NULL,
    member_id   UUID        NOT NULL,
    action      VARCHAR(10) NOT NULL,
    status      VARCHAR(10) NOT NULL,
    create_time TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  UUID,
    update_time TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by  UUID,
    delete_time TIMESTAMP,
    CONSTRAINT uniq_member_event UNIQUE (event_id, member_id)
);

CREATE INDEX IF NOT EXISTS event_member_index ON event_member (event_id, member_id);

-- MESSAGE
CREATE TABLE IF NOT EXISTS message (
    id          SERIAL PRIMARY KEY,
    member_id   UUID      NOT NULL,
    name        VARCHAR(255) NOT NULL,
    group_id    UUID      NOT NULL,
    event_id    UUID      NOT NULL,
    content     TEXT      NOT NULL,
    create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    delete_time TIMESTAMP
);

CREATE INDEX IF NOT EXISTS message_event_id ON message (event_id);
