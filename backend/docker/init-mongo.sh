mongo -- "$MONGO_INITDB_DATABASE" <<EOF
    var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
    var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
    var admin = db.getSiblingDB('admin');
    admin.auth(rootUser, rootPassword);

    var user = '$MONGO_INITDB_USERNAME';
    var password = '$MONGO_INITDB_ROOT_PASSWORD';

    db.createUser(
        {
            user: user, 
            pwd: password, 
            roles: [
                { role: "clusterAdmin", db: "admin" },
                { role: "readAnyDatabase", db: "admin" },
                "readWrite"
            ]
        }
    );
EOF