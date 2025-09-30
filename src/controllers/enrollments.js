const { where, Op } = require("sequelize");
const { Enrollments } = require("../../models/index.js");
const { validate } = require("uuid");

module.exports = {
    async createEnrollments(req, res) {
        const { full_name, email, phone, address, occupation } = req.body;

        const course_id = req.params.course_id;

        if (!course_id || !validate(course_id)) {
            return res.status(400).json({
                message: "O curso deve ser especificado"
            })
        }

        if (!full_name || !email || !phone) {
            return res.status(400).json({
                message: "Informe o seu nome e o seu contacto (email, phone)"
            })
        }

        if (!address || !occupation) {
            return res.status(400).json({
                message: "Diga o seu endereço e a sua ocupação"
            })
        }

        try {
            const newEnrollments = await Enrollments.create({
                full_name,
                email,
                phone,
                address,
                occupation,
                course_id: course_id
            });
            return res.status(201).json(newEnrollments);
        } catch (error) {
            return res.status(500).json({
                message: "Não foi possível increver-se, tente novamente",
                error: error
            });
        }
    },

    async eachEnrollments(req, res) {
        try {
            const enrollment_id = req.params.subscribe_id;

            if (!enrollment_id || !validate(enrollment_id)) {
                return res.status(400).json({
                    message: "O curso que se deseja pegar deve ser especificado"
                })
            }

            const enrollment = await Enrollments.findOne({
                where: {
                    id: enrollment_id
                }
            });

            if (!enrollment) {
                return res.status(400).json({
                    message: "Não foi encontrada este inscrição"
                })
            }

            return res.status(200).json(enrollment);
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao trazer a inscrição",
                error: error.message
            });
        }
    },

    async listEnrollments(req, res) {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const offset = limit * (page - 1);

        const course_id = await req.params.course_id;
        if (!course_id || !validate(course_id)) {
            return res.status(400).json({
                message: "deve especificar qual é o curso"
            });
        }

        try {
            const enrollments = await Enrollments.findAll({
                limit: limit,
                offset: offset,
                where: {
                    course_id: course_id
                }
            });
            return res.status(200).json(enrollments);
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao trazer os cursos",
                error: error
            });
        }
    },

    async deleteEnrollments(req, res) {
        try {
            const enrollment_id = req.params.subscribe_id;

            if (!enrollment_id || !validate(enrollment_id)) {
                return res.status(400).json({
                    message: "O curso que se deseja deletar deve ser especificado"
                })
            }

            const enrollment = await Enrollments.findOne({
                where: {
                    id: enrollment_id
                }
            });

            if (!enrollment) {
                return res.status(400).json({
                    message: "Inscrição não encontrado!"
                })
            }

            await Enrollments.destroy({
                where: {
                    id: enrollment_id
                }
            })

            return res.status(200).json({
                message: "Inscrição deletado com sucesso"
            });
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao deletar o curso",
                error: error.message
            });
        }

    },

    async searchSubscribed(req, res) {
        try {
            const { data } = req.body; // termo de busca
            const { course_id } = req.params;

            if (!course_id || !validate(course_id)) {
                return res.status(400).json({
                    message: "Por favor especifique o curso",
                });
            }

            if (!data) {
                return res.status(400).json({
                    message: "Por favor digite o nome, telefone ou email",
                });
            }

            let where = { course_id };

            if (data) {
                where[Op.or] = [
                    { email: { [Op.iLike]: `%${data}%` } },
                    { phone: { [Op.iLike]: `%${data}%` } },
                    { full_name: { [Op.iLike]: `%${data}%` } }
                ];
            }

            const enrollments = await Enrollments.findAll({
                where,
                order: [["createdAt", "DESC"]]
            });

            return res.status(200).json(enrollments);
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao buscar inscrições",
                error: error.message
            });
        }
    },

    async pay(req, res) {
        const subscribe_id = req.params.subscribe_id;

        if (!subscribe_id || !validate(subscribe_id)) {
            return res.status(400).json({
                message: "Por favor especifique o inscrição",
            });
        }
        try {
            const existSubscribe = await Enrollments.findOne({
                where: {
                    id: subscribe_id
                }
            });

            if (!existSubscribe) {
                return res.status(400).json({
                    message: "Não foi encontrado essa inscrição",
                })
            }

            if (existSubscribe.status == "paid") {
                return res.status(400).json({
                    message: "Essa inscrição já foi paga",
                })
            }

            await Enrollments.update({
                status: "paid"
            }, {
                where: {
                    id: subscribe_id
                }
            });
            return res.status(200).json({
                message: "Sucesso",
            })
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao fazer o pagamento",
                error: error.message
            })
        }
    }
}