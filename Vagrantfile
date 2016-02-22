Vagrant.configure(2) do |config|
    config.vm.synced_folder ".", "/vagrant", disabled: true
    config.vm.synced_folder ".", "/home/vagrant/workspace"

    config.vm.box = "ubuntu/trusty64"

    config.vm.provider :virtualbox do |virtualbox, override|
        virtualbox.customize ["modifyvm", :id, "--memory", "1024"]
    end

    config.vm.network "forwarded_port", guest: 8000, host: 8000

    config.vm.provision "shell", privileged: false, name: "Install Node.js",
        inline:
        %(
            bash -ic "$(curl -sL -o- https://git.io/v2LXX)" &> /dev/null
            bash -ic "nvm install 5 && nvm use 5" &> /dev/null
            bash -ic "npm install --global npm@3" &> /dev/null
        )

    config.vm.provision "shell", name: "Install Travis CI Gem",
        inline: "{ apt-get -y install ruby-dev && gem install travis ; } &> /dev/null"
end
