<?php

require __DIR__.'/vendor/autoload.php';

$config = require __DIR__.'/config/database-minimal.php';

try {
    $pdo = new PDO(
        "mysql:host={$config['connections']['mysql']['host']};" .
        "dbname={$config['connections']['mysql']['database']};",
        $config['connections']['mysql']['username'],
        $config['connections']['mysql']['password']
    );
    echo "Database connection successful!\n";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
