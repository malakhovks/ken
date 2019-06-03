## Howto: Install Alpine Linux 3.3 on VirtualBox OSX

- Latest Standard ISO version x86_64 is recommended (http://alpinelinux.org/downloads/)
- Create new VM ("Linux 2.6 / 3.x / 4.x (64-bit)")
- 1 CPU w/ 512BM RAM and 1 GB default (VDI) disk is more than sufficient
- Default networking (NAT)
- Boot and add Alpine ISO as attached virtual install media
- Default root password is blank (though note - ssh PermitRootLogin defaults to disallow blank passwords and: prohibit-password; switch to yes for Host ssh)
- Run setup-alpine
- Defaults are fine, but you *do* want "sys" disk setup to sda, y to confirm
- When done: halt
- Save disk state in VirtualBox
- *With VM shutdown*, choose VM, then Settings/Network. Add an Adapter 2 attached to Host-only Adapter (probably vboxnet0)
- Go to VirtualBox top level menu, then Preferences/Network/Host-only Networks
- Click DHCP Server, make sure it's on (this will assign host-only IP to eth1)
- Note the *Lower* Address Bound. Unless you're running multiple VMs simultaneously using Host-only, this will be your IP
- *Critical*: Choose Alpine VM in VirtualBox Manager, then Settings/Storage. Remove the IDE CD-ROM ISO (VM must be shutdown)
- If CD-ROM ISO is not removed, there is a 50/50 chance it will boot rather than the hard drive (I found no rhyme or reason for this)
- Boot Alpine VM
- In a rational world, your earlier hostname and sshd settings will persist
- Add secondary eth1 settings to permit Mac to Guest ssh access:
```
    vi  /etc/network/interfaces
    auto lo
    iface lo inet loopback
    
    auto eth0
    iface eth0 inet dhcp
    hostname bob
    
    auto eth1
    iface eth1 inet static
        address [ip from lower bound host-only dhcp, eg: 192.168.222.10]
        netmask 255.255.255.0
```

Then run:
```
    /etc/init.d/sshd restart
    /etc/init.d/networking restart
    ifconfig
```

You should now be able to ssh from OSX to the IP address on eth1 (but see notes above about passwordless and prohibit-password root defaults on sshd_config)

See the Alpine Wiki for more on installing additional packages and configuring iptables, ipv6 etc: http://wiki.alpinelinux.org/
Bootstrapping on AWS EC2 is here: http://wiki.alpinelinux.org/wiki/Install_Alpine_on_Amazon_EC2