As vrea sa improvizizi si sa adaugi in meniu 10 instante care crezi ca ar fiu cele mai bune, proiecte open source


instantele ar trebui sa fie foarte utile si sa aiba iconite..as vrea s ate gandesti la sidebr c ala un toolbar de ai super avansat dar din instante opensource, ca bolt.net, sau lobechat, sau langflow


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Docker CMS</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; display: flex; }
        #sidebar { width: 250px; background: #333; color: white; height: 100vh; padding: 15px; transition: width 0.3s; overflow: hidden; }
        #sidebar.collapsed { width: 50px; }
        #sidebar button { width: 100%; margin: 5px 0; }
        #content { flex-grow: 1; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .toggle-btn { background: #444; color: white; border: none; padding: 10px; cursor: pointer; }
    </style>
</head>
<body>
    <div id="sidebar">
        <button class="toggle-btn" onclick="toggleSidebar()">☰</button>
        <h3>Open Source Instances</h3>
        <button onclick="addInstance('WordPress')">WordPress</button>
        <button onclick="addInstance('Nextcloud')">Nextcloud</button>
        <button onclick="addInstance('GitLab')">GitLab</button>
        <button onclick="addInstance('Jenkins')">Jenkins</button>
        <button onclick="addInstance('MongoDB')">MongoDB</button>
        <button onclick="addInstance('MySQL')">MySQL</button>
        <button onclick="addInstance('Redis')">Redis</button>
        <button onclick="addInstance('PostgreSQL')">PostgreSQL</button>
        <button onclick="addInstance('Nginx')">Nginx</button>
        <button onclick="addInstance('Apache')">Apache</button>
    </div>
    <div id="content">
        <h2>Docker CMS</h2>
        <button onclick="fetchContainers()">Refresh Containers</button>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="container-list"></tbody>
        </table>
    </div>
    <script>
        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('collapsed');
        }

        function addInstance(name) {
            fetch('/containers/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: name.toLowerCase(), name: name })
            }).then(response => response.json())
              .then(data => alert(data.message))
              .catch(error => alert('Error creating instance: ' + error));
        }

        async function fetchContainers() {
            const response = await fetch('/containers');
            const data = await response.json();
            const tbody = document.getElementById('container-list');
            tbody.innerHTML = '';
            data.forEach(container => {
                const row = `<tr>
                    <td>${container.id}</td>
                    <td>${container.name}</td>
                    <td>${container.status}</td>
                    <td>
                        <button onclick="startContainer('${container.id}')">Start</button>
                        <button onclick="stopContainer('${container.id}')">Stop</button>
                        <button onclick="removeContainer('${container.id}')">Remove</button>
                    </td>
                </tr>`;
                tbody.innerHTML += row;
            });
        }
    </script>
</body>
</html>
