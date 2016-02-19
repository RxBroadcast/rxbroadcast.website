Vagrant.configure(2) do |config|
    config.vm.synced_folder ".", "/vagrant", disabled: true
    config.vm.synced_folder ".", "/home/vagrant/workspace"

    config.vm.box = "ubuntu/vivid64"

    config.vm.network "forwarded_port", guest: 8000, host: 8000

    config.vm.provision "shell", name: "Install Node.js",
        inline:
        %(
            ( curl --silent https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - ) &> /dev/null
            echo 'deb https://deb.nodesource.com/node_5.x vivid main' > /etc/apt/sources.list.d/nodesource.list
            ( apt-get update && apt-get -y install nodejs && npm --silent install --global npm@3 ) &> /dev/null
        )

    config.vm.provision "shell", name: "Install Travis CI Gem",
        inline: "{ apt-get -y install ruby-dev && gem install travis ; } &> /dev/null"

    config.vm.provision "shell", name: "Install AWS CLI",
        inline: "{ apt-get -y install python-pip && pip install --upgrade awscli ; } &> /dev/null"
end
