const header = require('../model/Header');

const HeaderController = {};

HeaderController.getHeader = async (req, res) => {
  try {
    const headers = await header.find();
    res.status(200).json(headers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching header', error });
  }
}

HeaderController.activeHeader = async (req, res) => {
  try {
    const headers = await header.findOne({ visible: true });
    res.status(200).json(headers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching header', error });
  }
}

HeaderController.createHeader = async (req, res) => {
  try {
    const body = req.body;

    const visible = body.visible === 'on';
    const headerlogo = body.headerlogo || null;
    const name = body.name || '';

    // --- Parse Topbar ---
    const parsedTopbar = {
      openingHours: {
        label: body['topbar[openingHours][label]'] || 'Opening Hours',
        value: body['topbar[openingHours][value]'] || null,
        visible: body['topbar[openingHours][visible]'] === 'on'
      },
      socialLinks: [],
      visible: body['topbar[visible]'] === 'on'
    };

    // Parse Social Links
    let socialIndex = 0;
    while (body[`topbar[socialLinks][${socialIndex}][icon]`]) {
      const socialLink = {
        icon: body[`topbar[socialLinks][${socialIndex}][icon]`] || '',
        link: body[`topbar[socialLinks][${socialIndex}][link]`] || '',
        visible: body[`topbar[socialLinks][${socialIndex}][visible]`] === 'on'
      };
      parsedTopbar.socialLinks.push(socialLink);
      socialIndex++;
    }

    // --- Parse Menu and Submenu ---
    const menu = [];
    let menuIndex = 0;

    while (body[`menu[${menuIndex}][name]`]) {
      const menuItem = {
        name: body[`menu[${menuIndex}][name]`] || '',
        link: body[`menu[${menuIndex}][link]`] || '',
        visible: body[`menu[${menuIndex}][visible]`] === 'on',
        submenu: []
      };

      let subIndex = 0;
      while (body[`menu[${menuIndex}][submenu][${subIndex}][name]`]) {
        const subItem = {
          name: body[`menu[${menuIndex}][submenu][${subIndex}][name]`] || '',
          link: body[`menu[${menuIndex}][submenu][${subIndex}][link]`] || '',
          visible: body[`menu[${menuIndex}][submenu][${subIndex}][visible]`] === 'on'
        };
        menuItem.submenu.push(subItem);
        subIndex++;
      }

      menu.push(menuItem);
      menuIndex++;
    }

    // --- Parse CTA ---
    const parsedCTA = {
      placeholder: body['cta[placeholder]'] || '',
      infoText: body['cta[infoText]'] || '',
      link: body['cta[link]'] || '',
      visible: body['cta[visible]'] === 'on'
    };

    // --- Parse Address ---
    const parsedAddress = {
      lable: body['address[lable]'] || '',
      value: body['address[value]'] || '',
      visible: body['address[visible]'] === 'on'
    };

    // --- Parse Contact ---
    const parsedContact = {
      lable: body['contact[lable]'] || '',
      value: body['contact[value]'] || '',
      visible: body['contact[visible]'] === 'on'
    };

    // --- Build Complete Header Data ---
    const headerData = {
      name,
      headerlogo,
      topbar: parsedTopbar,
      menu,
      cta: parsedCTA,
      address: parsedAddress,
      contact: parsedContact,
      visible
    };

    console.log("Parsed Header Data:", JSON.stringify(headerData, null, 2));

    const newHeader = new header(headerData); 
    await newHeader.save();

    res.status(201).json(newHeader);
  } catch (error) {
    console.error('Error creating header:', error);
    res.status(500).json({ message: 'Error creating header', error: error.message });
  }
};



HeaderController.addHeader = async (req, res) => {
  try {
    const newHeader = new header(req.body);
    await newHeader.save();
    res.status(201).json(newHeader);
  } catch (error) {
    res.status(500).json({ message: 'Error adding header', error });
  }
};

HeaderController.editHeader = async (req, res) => {
  try {
    const updatedHeader = await header.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedHeader);
  } catch (error) {
    res.status(500).json({ message: 'Error editing header', error });
  }
};

HeaderController.updateHeader = async (req, res) => {
  console.log("API call to update header");
  try {
    const body = req.body;

    const visible = body.visible === 'on';
    const headerlogo = body.headerlogo || null;
    const name = body.name || '';

    // --- Parse Topbar ---
    const parsedTopbar = {
      openingHours: {
        label: body['topbar[openingHours][label]'] || 'Opening Hours',
        value: body['topbar[openingHours][value]'] || null,
        visible: body['topbar[openingHours][visible]'] === 'on'
      },
      socialLinks: [],
      visible: body['topbar[visible]'] === 'on'
    };

    // Parse Social Links
    let socialIndex = 0;
    while (body[`topbar[socialLinks][${socialIndex}][icon]`]) {
      const socialLink = {
        icon: body[`topbar[socialLinks][${socialIndex}][icon]`] || '',
        link: body[`topbar[socialLinks][${socialIndex}][link]`] || '',
        visible: body[`topbar[socialLinks][${socialIndex}][visible]`] === 'on'
      };
      parsedTopbar.socialLinks.push(socialLink);
      socialIndex++;
    }

    // --- Parse Menu and Submenu ---
    const menu = [];
    let menuIndex = 0;

    while (body[`menu[${menuIndex}][name]`]) {
      const menuItem = {
        name: body[`menu[${menuIndex}][name]`] || '',
        link: body[`menu[${menuIndex}][link]`] || '',
        visible: body[`menu[${menuIndex}][visible]`] === 'on',
        submenu: []
      };

      let subIndex = 0;
      while (body[`menu[${menuIndex}][submenu][${subIndex}][name]`]) {
        const subItem = {
          name: body[`menu[${menuIndex}][submenu][${subIndex}][name]`] || '',
          link: body[`menu[${menuIndex}][submenu][${subIndex}][link]`] || '',
          visible: body[`menu[${menuIndex}][submenu][${subIndex}][visible]`] === 'on'
        };
        menuItem.submenu.push(subItem);
        subIndex++;
      }

      menu.push(menuItem);
      menuIndex++;
    }

    // --- Parse CTA ---
    const parsedCTA = {
      placeholder: body['cta[placeholder]'] || '',
      infoText: body['cta[infoText]'] || body['cta[text]'] || '',
      link: body['cta[link]'] || '',
      visible: body['cta[visible]'] === 'on'
    };

    // --- Parse Address ---
    const parsedAddress = {
      lable: body['address[lable]'] || '',
      value: body['address[value]'] || '',
      visible: body['address[visible]'] === 'on'
    };

    // --- Parse Contact ---
    const parsedContact = {
      lable: body['contact[lable]'] || '',
      value: body['contact[value]'] || '',
      visible: body['contact[visible]'] === 'on'
    };

    // --- Build Complete Header Data ---
    const headerData = {
      name,
      headerlogo,
      topbar: parsedTopbar,
      menu,
      cta: parsedCTA,
      address: parsedAddress,
      contact: parsedContact,
      visible
    };

    console.log("Parsed Updated Header Data:", JSON.stringify(headerData, null, 2));

    const updatedHeader = await header.findByIdAndUpdate(
      req.params.id,
      headerData,
      { new: true, runValidators: true }
    );

    if (!updatedHeader) {
      return res.status(404).json({ message: 'Header not found' });
    }

    res.status(200).json(updatedHeader);
  } catch (error) {
    console.error('Error updating header:', error);
    res.status(500).json({ message: 'Error updating header', error: error.message });
  }
};

module.exports = HeaderController;
